/** 发送数据到Worker*/
import { EventName } from '../interfaces'
import socket from '../utils/socket'

export function sendToServer(eventName:EventName,data) {
    return new Promise((res)=>{
        socket.emit(eventName,data);
        socket.on(eventName, function (resData) {
            res(resData);
        });
    })
}
