import io from 'socket.io-client'
import {SERVER} from '../observers/constants'
// import {SOCKET} from '../interfaces/observer'
//
// export default class Socket implements SOCKET{
//     public socket;
//     constructor(){
//         this.socket= io(SERVER.HttpHost,{transports:['polling','websocket']});
//         this.socket.on('connect', function () {
//             console.log("socket 连接成功");
//         });
//         this.socket.on('message', function (msg) {
//             console.log("message：",msg)
//         });
//     }
//
// }

let socket = io(SERVER.HttpHost,{transports:['polling','websocket']}); //'polling'
socket.on('connect', function () {
    console.log("socket 连接成功");
});
socket.on('message', function (msg) {
    console.log("message：",msg)
});

export default socket;

