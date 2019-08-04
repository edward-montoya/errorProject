import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
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
        let request = JSON.parse(message);
        if (!!request.control) {
            let response = new Response('control', undefined, undefined);
            if (clients.length < 2) {
                if(request.data === 'Transmisor' && t === 0) {
                    t++;
                    clients.push({id: socket.id, type: true});
                    if (r === 1) {
                        response.code = 201;
                    } else {
                        response.code = 202; 
                    }
                    io.emit('communication',JSON.stringify(response));
                } else if ( request.data === 'Receptor' && r === 0 ) {
                    r++;
                    clients.push({id: socket.id, type: false});
                    if (t === 1) {
                        response.code = 201;
                    } else {
                        response.code = 202;   
                    } 

                    io.emit('communication',JSON.stringify(response));
                } else {
                    let  error = new Response('error', 106, 'No se pueden usar dos ' + request.data);
                    io.to(socket.id).emit('communication',JSON.stringify(error));
                }
                if ( t === 1 && r === 1) {
                    response.code = 200;
                    response.data = 'Inicio de conexión';
                    io.emit('communication',JSON.stringify(response));
                }
            } else if (!!request.data && request.code === 600) {
                response.data = request.data;
                response.code = request.code;
                socket.broadcast.emit('communication', JSON.stringify(response));
            } else {
                let  error = new Response('error', 104, 'Máximo numero de conexiones');
                io.to(socket.id).emit('communication',JSON.stringify(error));
            }
            
        } else if ( clients.map(p => p.id).includes(socket.id) ) {
            console.log(message);
            socket.broadcast.emit('communication', message);
        } else {
        }
    });
    socket.on('disconnect', function() {
        if(clients.map(p => p.id).includes(socket.id)) {
            let client =  clients.find(p => p.id === socket.id);
            clients = clients.filter(p => p.id !== socket.id);        
            if (client.type) {
                t = 0;
            } else {
                r = 0;
            }
        }
        let  error = new Response('error', 104, 'Cliente desconectado');
        io.emit('communication',JSON.stringify(error));
    });
});

server.listen(port, () => {
    console.log(`started on port: ${port}`);
});