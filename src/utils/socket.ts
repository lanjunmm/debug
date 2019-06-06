import io from 'socket.io-client'
import {SERVER} from '../observers/constants'
import {SOCKET} from '../interfaces/observer'

class Socket implements SOCKET{
    public connect=null;
    public SocketID="";
    constructor(){

    }

    public install(){
       return new Promise((res)=>{
            this.connect= io(SERVER.HttpHost,{transports:['polling','websocket']});
            this.connect.on('connect', function () {
                console.log("socket 连接成功");
            });
           socket.connect.on('id',  (msg)=> {
               console.log("id：", msg);
               this.SocketID = msg;
               socket.connect.emit("id", {id: this.SocketID, name: "worker"});
               res('success');
           });
           this.connect.on('message', function (msg) {
               console.log("message：",msg)
           });
        })
    }
}

// let socket = io(SERVER.HttpHost,{transports:['polling','websocket']}); //'polling'
// let SocketID ="";
// socket.on('connect', function () {
//     console.log("socket 连接成功");
// });
// socket.on('id', function (msg) {
//     console.log("id：",msg);
//     SocketID = msg;
//     socket.emit("id",{id:SocketID,name:"worker"});
// });
let socket = new Socket();
export default socket;

