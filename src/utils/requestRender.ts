/** 发送数据到Render*/
// import socket from '../utils/socket'

export function sendToRender(data) {
    return new Promise((res)=>{
        console.log(data);
        res();
        // socket.emit("network",data);
        // socket.on('network', function (resData) {
        //     console.log("network：",resData);
        //     res(resData);
        // });
    })
}
