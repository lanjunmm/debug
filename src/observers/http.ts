import EventHub from "../utils/eventHub";
import {HttpFuncs, HttpReqMsgs, Observer} from "../interfaces/observer";
import {_newuuid, _replace, _unReplace} from '../utils/tools'
import {sendToRender} from '../utils/requestRender'
import {REQUESTINIT} from './constants'
// import {isFunction} from '../utils/is'

/**大致思路完成部分：Fetch
 * */
export default class HttpObserver extends EventHub implements Observer {
    private xhrReqMap: Map<string, HttpReqMsgs> = new Map();
    private urlMatch = /(\w+):\/\/([^/:]+)(:\d*)?([^# ]*)/;

    constructor() {
        super()
    }

    private hackBeacon() {
        if (!!navigator.sendBeacon) {
            return;
        }
        function replaceBeacon() {
            return function (this: Navigator, url: string, data) {
                    const msg: HttpReqMsgs = {
                        type: "network",
                        requestFunc: HttpFuncs.beacon,
                        url: url,
                        data: data
                    };
                    sendToRender(msg);
            }
        }
        _replace(window.navigator, "sendBeacon", replaceBeacon);
    }

    private hackFetch() {
        if (!(window.fetch && window.fetch.toString().includes('native'))) {
            return;
        }
        function replaceFetch(originFetch) {
            return function (input: string | Request, config?: RequestInit) {
                return new Promise((res,rej)=>{
                    let fetchArgs = {
                        firstArg: {
                            type: "",
                            url: null
                        },
                        secondArg:null
                    };

                    if(typeof input === 'string'){
                        fetchArgs.firstArg.type = "url";
                        fetchArgs.firstArg.url = input;
                    }else if (input instanceof Request){
                        let keys = Object.keys(REQUESTINIT);
                        let obj = {};
                        for(let i=0;i<keys.length;i++){
                            let key= keys[i];
                            if(key=="headers"){
                                let headers = REQUESTINIT[key];
                                input[keys[i]].forEach((v,k)=>{ headers.push([k,v]); });
                                obj[key] = headers;
                                continue;
                            }
                            obj[key] = input[key] || REQUESTINIT[key];
                        }
                        fetchArgs.firstArg.type = "Request";
                        fetchArgs.firstArg.url = input['url'];
                        fetchArgs.secondArg = obj;
                    }
                    if(!!config){
                        let keys = Object.keys(config);
                        for(let i=0;i<keys.length;i++){
                            let key = keys[i];
                            if(key=="headers"){
                                let headers = fetchArgs.secondArg[key];
                                // @ts-ignore
                                config[key].forEach((v,k)=>{ headers.push([k,v]); });
                                if(headers.length>0){ fetchArgs.secondArg[key] = headers; }
                                continue;
                            }
                            fetchArgs.secondArg[key]=  config[key] || fetchArgs.secondArg[key] ;
                        }
                    }
                    const msg:HttpReqMsgs = {
                        type: 'network',
                        requestFunc: HttpFuncs.fetch,
                        data: fetchArgs
                    };
                    sendToRender(msg);
                    //TODO: 转发fetch信息到Render,接收Render的消息,并返回Response对象
                    originFetch.apply(this,[...arguments]).then(reseponse=>{
                        res(reseponse);
                    }).catch(typeError=>{
                        rej(typeError);
                    });
                });
            }
        }
        _replace(window, 'fetch', replaceFetch);
    }

    private hackXHR() {
        let that = this;

        function replaceXHRSetRequestHeader(originFunc) {
            return function (this, key: string, value: any) {
                if (this.__local__) {
                    originFunc.apply(this, [...arguments]);
                } else {
                    const requestId = this.__id__;
                    let msg: HttpReqMsgs = {
                        type: "network",
                        requestFunc: HttpFuncs.xhr,
                        steps: "setHeader",
                        headers: {},
                        reqId: requestId
                    };
                    msg.headers[key] = value;
                    sendToRender(msg);
                }
            }
        }

        function replaceXHROpen(originOpen) {
            return function (this, method, url) {
                this.__local__ = false;
                let location = url.match(that.urlMatch);
                if (location != null && (location[2] == "localhost" || location[2] == "127.0.0.1")) {
                    this.__local__ = true;
                    originOpen.apply(this, [...arguments]);
                } else {
                    const requestId = _newuuid();
                    this.__id__ = requestId;
                    let msg: HttpReqMsgs = {
                        type: "network",
                        requestFunc: HttpFuncs.xhr,
                        steps: "open",
                        url: url,
                        method: method,
                        reqId: requestId
                    };
                    that.xhrReqMap.set(requestId, msg);
                    sendToRender(msg);
                    console.log(this.readyState);
                }
            }
        }

        function replaceXHRSend(originSend) {
            return function (this, body) {
                if (this.__local__) {
                    originSend.apply(this, [...arguments]);
                }
                else {
                    const thisXHR = this;
                    let msg: HttpReqMsgs = {
                        type: 'network',
                        requestFunc: HttpFuncs.xhr,
                        steps: "send",
                        data: body
                    };

                    function onreadystatechangeHandler(): void {
                        console.log("onreadystatechangeHandler");
                    }

                    // TODO: hijack xhr.onerror, xhr.onabort, xhr.ontimeout
                    // TODO: onreadystateChange方法将在xhr.readyState改变后调用----> 改为，接收到Render的readyState改变的消息后调用
                    _replace(thisXHR, 'onreadystatechange', originalStateChangeHook => {
                        return (...args) => {
                            try {
                                onreadystatechangeHandler.call(thisXHR)
                            } catch (err) {
                                console.error(err);
                            }
                            // 调用原本的onreadystateChange方法
                            originalStateChangeHook.call(thisXHR, ...args)
                        }
                    })
                    sendToRender(msg);
                    console.log(thisXHR.readyState);
                }

            }
        }

        const XHRProto = XMLHttpRequest.prototype;
        _replace(XHRProto, 'setRequestHeader', replaceXHRSetRequestHeader)
        _replace(XHRProto, 'open', replaceXHROpen)
        _replace(XHRProto, 'send', replaceXHRSend)
    }

    public install() {
        this.hackBeacon();
        this.hackFetch();
        this.hackXHR();
    }

    public uninstall() {
        _unReplace(window.navigator, 'sendBeacon');
        _unReplace(window, 'fetch');
    }

}