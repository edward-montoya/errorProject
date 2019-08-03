import express from 'express';
import http from 'http';
import socketIO from 'socket.io';

let app = express();

let server = http.Server(app);

let io = socketIO(server);

const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log('user connected');
});

server.listen(port, () => {
    console.log(`started on port: ${port}`);
});