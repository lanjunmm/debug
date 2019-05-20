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
export type HttpReqMsgs = {
    type:string
    requestFunc: HttpFuncs
    url?: string
    headers?: { [key: string]: any } // nonexistence in beacon request
    data?:any
    input?: any[] // fetch request payload
    payload?: any // xhr request payload
    response?: any
    method?: string
    status?: number
    errmsg?: any
    steps?: string,
    reqId?: any
}