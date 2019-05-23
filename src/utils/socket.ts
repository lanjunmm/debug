import io from 'socket.io-client'

let socket = io('ws://localhost:3000',{transports:['polling','websocket']}); //'polling'
socket.on('connect', function (socket) {
    console.log("连接",socket)
});
socket.on('message', function (socket) {
    console.log("message：",socket)
});

export default socket;

