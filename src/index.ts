import Jsonp from './observers/jsonp'
import HttpObserver from './observers/http'
import { Observer } from './interfaces/observer'

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
    public start(){
        console.log('start');
        // hack
        Object.keys(this.observers).forEach(observerName => {
            if (this.observers[observerName]!=null) {
                (this.observers[observerName] as Observer).install();
            }
        })
    }
}