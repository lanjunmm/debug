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
