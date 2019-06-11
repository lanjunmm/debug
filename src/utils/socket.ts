import io from 'socket.io-client'
import {SERVER} from '../observers/constants'
import {SOCKET} from '../interfaces/observer'
import snapShot from "./SnapShot";
import {EventName} from "../interfaces";
import EventHub from "../utils/eventHub";

class Socket extends EventHub implements SOCKET{
    public connect=null;
    public SocketID="";
    constructor(){
        super();
        this.install();
    }

    public install(){
       // return new Promise((res)=>{
            this.connect= io(SERVER.HttpHost,{transports:['polling','websocket']});
            this.connect.on('connect',  ()=> {
                console.log("socket 连接成功");
                this.getSnapshot();
                this.$emit('initMutation');
            });
           this.connect.on('id',  (msg)=> {
               console.log('id: ',msg);
               this.SocketID = msg;
               this.connect.emit("id", {id: this.SocketID, name: "worker"});
               // res('success');
           });
           console.log("socket");
        // })
    }

    public sendToServer(eventName:EventName,data) {
        return new Promise((res)=>{
            console.log(eventName);
            this.connect.emit(eventName,data);
            this.connect.on(eventName, function (resData) {
                res(resData);
            });
        })
    }

    private getSnapshot(){
        const { clientWidth: w, clientHeight: h } = document.documentElement
        const isStandardsMode = document.compatMode === 'CSS1Compat'
        const x = isStandardsMode ? document.documentElement.scrollLeft : document.body.scrollLeft
        const y = isStandardsMode ? document.documentElement.scrollTop : document.body.scrollTop
        const host = location.protocol+"//"+location.host;
        let firtstSnapShot =  {
            type: 'snapshot',
            scroll: { x, y },
            resize: { w, h},
            referer:host,
            snapshot: snapShot.takeSnapshotForPage() // 第一次调用返回值是<head>部分outerHtml
        };
        console.log("发出快照");
        this.connect.emit('snapshot',firtstSnapShot);
        // this.sendToServer('snapshot',firtstSnapShot).then(resData=>{
        //     console.log("snapShot: ",resData);
        // });
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

