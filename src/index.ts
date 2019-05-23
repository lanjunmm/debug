import Jsonp from './observers/jsonp'
import HttpObserver from './observers/http'
import { Observer } from './interfaces/observer'
import socket from './utils/socket'

export default class Worker {
    observers = {
        mutation: null,
        console: null,
        event: null,
        mouse: null,
        error: null,
        history: null,
        http: null,
        jsonp:null
    }
    constructor(){
        this.observers.jsonp=new Jsonp();
        this.observers.http=new HttpObserver();
    }
    public connect(){
        console.log(socket)
        if(socket){
            console.log("发送");
            socket.emit('message', 'world');
        }
    }
    public start(){
        // hack
        this.connect();
        Object.keys(this.observers).forEach(observerName => {
            if (this.observers[observerName]!=null) {
                (this.observers[observerName] as Observer).install();
            }
        })
    }
}