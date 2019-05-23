export type Observer = {
    install(): void
    uninstall(): void
} & PubSubPattern

export type PubSubPattern = {
    queue: Map<string, Function[]>
    $on(hook: string, action: Function): void
    $off(hook: string, thisAction: Function): void
    $emit(hook: string, ...args): void
}

export enum HttpFuncs {
    beacon = 'beacon',
    fetch = 'fetch',
    xhr = 'xhr'
}
export enum MessageTypes {
    network = 'network',
    jsonp = 'jsonp',
    dom = 'dom'
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