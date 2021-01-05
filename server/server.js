const http=require('http');
const express=require('express');
const socketio=require('socket.io');

const app=express();

const clientPath=`${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`);

app.use(express.static(clientPath));

const server=http.createServer(app);

const io=socketio(server);
var clients=0;
var Player1="NULL";
var Player2="NULL";
io.on('connection',(sock)=>{
    console.log('Someone connected');
    clients++;
    if(clients==1){
        Player1=sock.id;
        Player2="NULL";
    }else if(clients==2){
        Player2=sock.id;
    }
    console.log(clients);
    console.log(sock.id);
    io.sockets.emit('broadcast',{ count: clients,ID1:Player1,ID2:Player2});
    sock.on('disconnect', function(){
        console.log('A user disconnected');
        clients--;
        if(clients==1 && Player1==sock.id){
            Player1=Player2;
            Player2="NULL";
        }else if(clients==1 && Player2==sock.id){
            Player2="NULL";
        }else if(clients==0){
            Player1="NULL";
            Player2="NULL";
        }
        console.log(clients);
        console.log(sock.id);
        io.sockets.emit('broadcast',{ count: clients,ID1:Player1,ID2:Player2});
    });
    sock.on('message1',(v1)=>{
        if(v1.Identity==Player1){
        sock.broadcast.emit('message2',{
           ID:Player1,
           ballflag:v1.ballflag,
           ballx:v1.ballx,
           bally:v1.bally,
           ballvx:v1.ballvx,
           ballvy:v1.ballvy,
           ballpaddleX:v1.ballpaddleX,
           ballscore:v1.ballscore
           
        });
    }else{
        sock.broadcast.emit('message2',{
            ID:Player2,
            ballflag:v1.ballflag,
            ballx:v1.ballx,
            bally:v1.bally,
            ballvx:v1.ballvx,
            ballvy:v1.ballvy,
            ballpaddleX1:v1.ballpaddleX1,
            ballscore1:v1.ballscore1
            
         }); 

    }
    });

});
server.on('error',(err)=>{
    console.error('Server error:',err);
});

server.listen(process.env.PORT || 5000,()=>{
    console.log('RPS started on 8080');
});