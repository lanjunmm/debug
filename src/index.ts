import Jsonp from './observers/jsonp'
import HttpObserver from './observers/http'
import EventObserver from './observers/event'
import { Observer } from './interfaces/observer'
import { Observers } from './interfaces' //ObserverName,
import socket from './utils/socket'
import {_warn} from './utils/tools'
import { sendToServer } from './utils/requestServer'
import snapShot from './utils/SnapShot'
import DOMMutationObserver from './observers/mutation'
import MouseObserver from './observers/mouse'
import HistoryObserver from './observers/history'
import ConsoleObserver from './observers/console'
import ErrorObserver from './observers/error'
import {RECORD_CONFIG} from './observers/constants'


export default class Worker {
    public observers:Observers = {
        mutation: null,
        console: null,
        event: null,
        mouse: null,
        error: null,
        history: null,
        http: null,
        jsonp:null,
    }
    public debuging:boolean =false;
    public options = RECORD_CONFIG;

    constructor(options?){
        if (options && typeof options === 'object') {
            this.options = { ...this.options, ...options }
        }
        const { mutation, history, http, event, error, console: consoleOptions, mouse,jsonp } = this.options

        this.observers.jsonp=new Jsonp(jsonp);
        this.observers.http=new HttpObserver(http);
        this.observers.event = new EventObserver(event);
        this.observers.mutation = new DOMMutationObserver(mutation);
        this.observers.mouse = new MouseObserver(mouse);
        this.observers.history = new HistoryObserver(history);
        this.observers.console = new ConsoleObserver(consoleOptions);
        this.observers.error = new ErrorObserver(error);

        // Object.keys(this.observers).forEach((observerName: ObserverName) => {
        //     const observer = this.observers[observerName];
        //     if(observer!=null){
        //         observer.$on('sendToServer', sendToServer);
        //     }
        // })
    }
    public connect(){
        if(socket){
            socket.emit('message', '测试Emit');
        }
    }
    private getSnapshot(){
        const { clientWidth: w, clientHeight: h } = document.documentElement
        const { x, y } = (this.observers.event as any).getScrollPosition()
        const host = location.host;
        let firtstSnapShot =  {
            type: 'snapshot',
            scroll: { x, y },
            resize: { w, h},
            referer:host,
            snapshot: snapShot.takeSnapshotForPage() // 第一次调用返回值是outerHtml
        }
        sendToServer('snapshot',firtstSnapShot).then(resData=>{
            console.log("snapShot: ",resData);
        })
    }
    public start(){
        // hack
        if (this.debuging) {
            _warn('record already started')
            return
        }

        this.debuging = true
        this.connect();
        this.getSnapshot();

        Object.keys(this.observers).forEach(observerName => {
            if (this.observers[observerName]!=null) {
                (this.observers[observerName] as Observer).install();
            }
        })
    }
}
