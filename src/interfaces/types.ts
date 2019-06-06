// export enum Events {
//     move= 'move',
//     click= 'click',
//     attr="attr",
//     node= "node",
//     text= "text",
//     form= "form",
//     resize= "resize",
//     scroll="scroll",
//     snapshot="snapshot",
//     jsonp="jsonp",
//     http="http"
// }
export enum DOMMutationTypes {
    attr = 'attr', // attribute mutate
    node = 'node', // node add or remove
    text = 'text' // text change
}
export interface NodeMutationData {
    index?: number;
    type: 'text' | 'ele';
    target?: number;
    textContent?: string;
    html?: string;
}
export declare type DOMMutationRecord = {
    type: DOMMutationTypes;
    target: number;
    attr?: {
        k: string;
        v: string;
    };
    prev?: number;
    next?: number;
    add?: NodeMutationData[];
    remove?: NodeMutationData[];
    text?: string;
    html?: string;
};


export type EVENTS = {
    move: any,
    click: any,
    attr: any,
    node: any,
    text: any,
    form: any,
    resize: any,
    scroll: any,
    dom:any,
    jsonp:any,
    http:any,
    default?:any
}

export enum HttpFuncs {
    beacon = 'beacon',
    fetch = 'fetch',
    xhr = 'xhr'
}
export type HttpReqMsgs = {
    type:string
    requestFunc: HttpFuncs,
    reqId:any
    url?: string
    headers?: { [key: string]: any } // nonexistence in beacon request
    data?:any
    payload?: any // xhr request payload
    response?: any
    method?: string
    status?: number
    errmsg?: any
    steps?: string
}
export type HTTP = {
    fetch(reqMsg:HttpReqMsgs):Object
    sendbeacon(reqMsg:HttpReqMsgs):Object
    xhr(reqMsg:HttpReqMsgs):Object
}

export type HTTPResponse = {
    reqId:string
    data:Object
}

export type JSONPArguments = {
    type: string,
    taName: string,
    src: string
};
