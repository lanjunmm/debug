import DebugCordova from './debugCorodva'
class CordovaObserver {
    constructor(){
        window['cordova'] =  DebugCordova;
    }

}

let cordova = new CordovaObserver();
export default cordova;
