import io from 'socket.io-client'
import {SERVER} from './constants'
import {HttpFuncs, HttpReqMsgs,HTTPResponse,JSONPArguments} from '../interfaces/types'
import httpPlayer from '../palyers/http'
import jsonpPlayer from '../palyers/jsonp'

let socket = io(SERVER.HttpHost,{transports:['polling','websocket']}); //'polling'
let SocketID ="";

socket.on('connect', function () {
    console.log("socket 连接成功");
});
socket.on('id', function (msg) {
    console.log("id：",msg);
    SocketID = msg;
    socket.emit("id",{id:SocketID,name:"render"});
});

/** 执行http请求，将结果发回Server*/
socket.on('fetch',function (reqMsg:HttpReqMsgs) {
    if(reqMsg.requestFunc!=HttpFuncs.fetch){ return;}
    httpPlayer.fetch(reqMsg).then(data=>{
        let ResMsg:HTTPResponse= {
            reqId:reqMsg.reqId,
            data:data
        };
        socket.emit("fetch",ResMsg);
        console.log("fetch Data:",ResMsg);
    });
});
socket.on('xhr',function (reqMsg:HttpReqMsgs) {
    if(reqMsg.requestFunc!=HttpFuncs.xhr){ return;}
    httpPlayer.xhr(reqMsg).then(data=>{
        let ResMsg:HTTPResponse= {
            reqId:reqMsg.reqId,
            data:data
        };
        socket.emit("xhr",ResMsg);
        console.log("xhr Data:",ResMsg);
    });
});
socket.on('beacon',function (reqMsg:HttpReqMsgs) {
    if(reqMsg.requestFunc!=HttpFuncs.beacon){ return;}
    console.log(reqMsg)
    httpPlayer.sendbeacon(reqMsg).then(data=>{
        let ResMsg:HTTPResponse= {
            reqId:reqMsg.reqId,
            data:data
        };
        socket.emit("beacon",ResMsg);
        console.log("beacon Data:",ResMsg)
    });
});

/** 发送jsonp请求，将结果发回Server*/
socket.on("jsonp",function (jsonpMsg:JSONPArguments) {
    jsonpPlayer.jsonp(jsonpMsg);
});
socket.on("snapshot",function () {

});
socket.on("mutation",function () {

});
socket.on("history",function () {

});
socket.on("event",function () {

});


export default socket;

