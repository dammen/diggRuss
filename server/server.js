var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(5000);
console.log("server listening")
io.on('connection', function (socket) {
    socket.on('join', function (data) {
        console.log("joined")
        console.log(data)
        socket.join(data.roomId);
        socket.room = data.roomId;
        console.log(socket.room)
        console.log("setting")
        const sockets = io.of('/').in().adapter.rooms[data.roomId];
        console.log("emitting")
        console.log(sockets.length)
        if(sockets.length===1){
            socket.emit('init')
            console.log("first")
        }else{
            if (sockets.length===2){
                io.to(data.roomId).emit('ready')
                console.log("second")
            }else{
                console.log("full")
                socket.room = null
                socket.leave(data.roomId)
                socket.emit('full')
            }
            
        }
    });
    socket.on('signal', (data) => {
        console.log("signal")
        io.to(data.room).emit('desc', data.desc)        
    })
    socket.on('disconnect', () => {
        const roomId = Object.keys(socket.adapter.rooms)[0]
        if (socket.room){
            io.to(socket.room).emit('disconnected')
        }
        
    })
});
