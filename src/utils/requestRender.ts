/** 发送数据到Render*/
import socket from '../utils/socket'

export function sendToRender(data) {
    return new Promise((res)=>{
        socket.emit("jsonp",data);
        socket.on('jsonp', function (resData) {
            console.log("jsonp：",resData);
            res(resData);
        });
    })
}
