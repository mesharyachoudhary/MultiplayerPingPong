const http=require('http');
const express=require('express');
const socketio=require('socket.io');

const app=express();

const clientPath=`${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`);

app.use(express.static(clientPath));

const server=http.createServer(app);

const io=socketio(server);
io.on('connection',(sock)=>{
    console.log('Someone connected');

    /*sock.on('message',(v)=>{
        sock.broadcast.emit('message',v);
    });*/

    sock.on('message1',(v1)=>{
        sock.broadcast.emit('message1',v1);
    });
});

server.on('error',(err)=>{
    console.error('Server error:',err);
});

server.listen(8080,()=>{
    console.log('RPS started on 8080');
});