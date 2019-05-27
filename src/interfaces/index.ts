import {Observer} from "./observer";

export type ElementX = HTMLElement | Element

export interface FormELement extends HTMLElement {
    type: string
    value: string
    checked?: boolean
}
export type ObserverName = 'mutation' | 'console' | 'event' | 'mouse' | 'error' | 'history' | 'http' | 'jsonp'
export type EventName = 'mutation' | 'console' | 'event' | 'mouse' | 'error' | 'history' | 'jsonp' | 'snapshot'
export type Observers = { [key in ObserverName]: Observer }

export interface SnapShoter {
    inited: boolean
    latestSnapshot: string
    takeSnapshotForPage(): void
}

export interface MutationRecordX extends MutationRecord {
    target: HTMLElement
    previousSibling: HTMLElement
    nextSibling: HTMLElement
}