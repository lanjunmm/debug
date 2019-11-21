import socket from './utils/socket'

export default class Render {
    constructor(){
        window['_debugSocket']=socket; // jsonp 全局script返回时
        window['_sendToServer']=function sendToServer(funcName,data) {
            let socket = window['_debugSocket'];
            let msg = funcName+"("+JSON.stringify(data)+")";
            console.log(msg);
            socket.emit("jsonp",msg);
        };

        // document.addEventListener('DOMContentLoaded', ()=>{
            let blanket = `<html lang="en"><head><meta charset="UTF-8"><title>Ready</title></head></html>`;
            document.documentElement.innerHTML = blanket;
            document.write(blanket);
            document.body = document.createElement('body');
            document.body.innerText="READY";
        // });
    }
}
/** 打包留出全局接口：*/
window['render'] = new Render();

