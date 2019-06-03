import socket from './utils/socket'

export default class Render {
    constructor(){
        window['_debugSocket']=socket;
    }
}

