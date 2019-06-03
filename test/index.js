import Render from '../src/index'

let render = new Render();

window['_sendToServer']=function sendToServer(funcName,data) {
    let socket = window['_debugSocket'];
    // let msg = {
    //     funcName:funcName,
    //     args:data
    // };
    let msg = funcName+"("+JSON.stringify(data)+")";
    console.log(msg);
    socket.emit("jsonp",msg);
};


// document.addEventListener('DOMContentLoaded', start);


