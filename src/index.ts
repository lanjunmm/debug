import socket from './utils/socket'

export default class Render {
    constructor(){
        window['_debugSocket']=socket; // jsonp 全局script返回时

        const playerDefaultStyle = document.createElement('style');
        playerDefaultStyle.setAttribute('type', 'text/css');
        playerDefaultStyle.innerHTML = `body{background: #000;}`;
        document.head!.insertBefore(playerDefaultStyle, document.head!.firstChild!);
    }
}

