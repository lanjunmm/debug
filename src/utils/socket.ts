import io from 'socket.io-client'
import {SERVER} from './constants'
import {HttpFuncs, HttpReqMsgs,HTTPResponse,JSONPArguments} from '../interfaces/types'
import Player from '../palyers/index'
import {DOMMutationTypes} from '../interfaces/types'


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

/** 执行http请求，将结果连带着reqID发回Server*/
socket.on('fetch',function (reqMsg:HttpReqMsgs) {
    if(reqMsg.requestFunc!=HttpFuncs.fetch){ return;}
    Player.events.http.fetch(reqMsg).then(data=>{
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
    Player.events.http.xhr(reqMsg).then(data=>{
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
    Player.events.http.sendbeacon(reqMsg).then(data=>{
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
    Player.events.jsonp.jsonp(jsonpMsg);
});
socket.on("snapshot",function (data) {
    Player.events.dom.renderSnapshot(data);
});
socket.on("mutation",function (data) {
    switch (data.type) {
        case DOMMutationTypes.node:
            Player.events.dom.paintNodeAddorRemove(data);
            break;
        case DOMMutationTypes.attr:
            break;
        case DOMMutationTypes.text:
            break;
        default:
            break;
    }
});
socket.on("history",function () {

});
socket.on("event",function (data) {
    if(data.type==="scroll"){
        const {x,y,target}=data;
        Player.events.dom.paintScroll({x,y,target});
    }else{
        const { w, h } =data;
        Player.events.dom.paintResize({w,h});
    }

});


export default socket;

