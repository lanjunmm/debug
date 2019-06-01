import Jsonp from './observers/jsonp'
import HttpObserver from './observers/http'
import EventObserver from './observers/event'
import {Observer } from './interfaces/observer'
import {WORKER,ObserverName,Observers } from './interfaces'
import socket from './utils/socket'
import {_warn} from './utils/tools'
import { sendToServer } from './utils/requestServer'
import snapShot from './utils/SnapShot'
import DOMMutationObserver from './observers/mutation'
import MouseObserver from './observers/mouse'
import HistoryObserver from './observers/history'
import IframeObserver from './observers/iframe'
import ConsoleObserver from './observers/console'
import ErrorObserver from './observers/error'
import {RECORD_CONFIG} from './observers/constants'


export default class Worker implements WORKER{
    public observers:Observers = {
        mutation: null,
        console: null,
        event: null,
        mouse: null,
        error: null,
        history: null,
        http: null,
        jsonp:null,
        iframe:null
    }
    public debuging:boolean =false;
    public options = RECORD_CONFIG;

    constructor(options?){
        if (options && typeof options === 'object') {
            this.options = { ...this.options, ...options }
        }
    }
    public initObservers(){
        const { mutation, history, http, event, error, console: consoleOptions, mouse,jsonp,iframe } = this.options
        this.observers = {
            mutation: new DOMMutationObserver(mutation),
            http: new HttpObserver(http),
            console: new ConsoleObserver(consoleOptions),
            event: new EventObserver(event),
            mouse: new MouseObserver(mouse),
            error: new ErrorObserver(error),
            history: new HistoryObserver(history),
            jsonp: new Jsonp(jsonp),
            iframe:new IframeObserver(iframe)
        }
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
            snapshot: snapShot.takeSnapshotForPage() // 第一次调用返回值是<head>部分outerHtml
        }
        sendToServer('snapshot',firtstSnapShot).then(resData=>{
            console.log("snapShot: ",resData);
        })
    }
    public start(){
        // hack
        console.log("start")
        this.initObservers();
        if (this.debuging) {
            _warn('worker already started')
            return
        }

        this.debuging = true
        this.connect();
        this.getSnapshot();

        Object.keys(this.observers).forEach((observerName:ObserverName) => {
            if (this.observers[observerName]!=null) {
                (this.observers[observerName] as Observer).install();
            }
        })
    }
    public stop = (): void => {
        if (!this.debuging) {
            _warn('worker not started')
            return
        }
        this.debuging = false
        this.uninstallObservers();
    }
    public uninstallObservers = (): void => {
        // walk and uninstall observers
        Object.keys(this.observers).forEach((observerName:ObserverName) => {
            ;(this.observers[observerName] as Observer).uninstall()
        })
    }
}

/** 打包留出全局接口：*/
// window['worker'] = function () {
//     return new Worker();
// }
