import io from 'socket.io-client'
import {SERVER} from '../observers/constants'

let socket = io(SERVER.HttpHost,{transports:['polling','websocket']}); //'polling'
socket.on('connect', function () {
    console.log("socket 连接成功");
});
socket.on('message', function (msg) {
    console.log("message：",msg)
});

export default socket;

