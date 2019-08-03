import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import { Client } from './models/client'
import { Response } from './models/response'


let app = express();

let server = http.Server(app);

let io = socketIO(server);

const port = process.env.PORT || 3000;

var clients = [];
var t = 0;
var r = 0;
io.on('connection', (socket) => {
    
    socket.on('communication', (message) => {
        let client = JSON.parse(message);
        if (!!client.control) {
            let actualClient = new Client(socket.id, undefined);
            let response = new Response('control', undefined, undefined);
            if (clients.length < 2) {
                if(client.ctrlMessage === 'Transmisor' && t === 0) {
                    actualClient.action = true;
                    t++;
                    clients.push(actualClient);
                    response.code = 201;
                    response.data = actualClient;
                    io.to(socket.id).emit('communication',JSON.stringify(response));
                } else if ( client.ctrlMessage === 'Receptor' && r === 0 ) {
                    actualClient.action = false;
                    r++;
                    clients.push(actualClient);
                    response.data = actualClient;
                    response.code = 201;
                    io.to(socket.id).emit('communication',JSON.stringify(response));
                } else {
                    let  error = new Response('error', 106, 'No se pueden usar dos ' + client.ctrlMessage);
                    io.to(socket.id).emit('communication',JSON.stringify(error));
                }
                if ( t === 1 && r === 1) {
                    response.code = 200;
                    response.data = 'Inicio de conexión';
                    io.emit('communication',JSON.stringify(response));
                }
            } else {
                let  error = new Response('error', 104, 'Máximo numero de conexiones');
                io.to(socket.id).emit('communication',JSON.stringify(error));
            }
            
        } else if ( clients.map((c) => c.id).includes(client.id) ) {

        } else {
        }
    });
    socket.on('disconnect', function() {
        if (clients.map((c) => c.id).includes(socket.id)) {
            let client = clients.pop();
            if (client.action) {
                t--;
            } else {
                r--;
            }
        }
        console.log('Got disconnect!');
        let  error = new Response('error', 104, 'Cliente desconectado');
        io.emit('communication',JSON.stringify(error));
    });
});

server.listen(port, () => {
    console.log(`started on port: ${port}`);
});