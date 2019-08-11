let workerSocket=null;
let renderSocket=null;
let ClientMap = new Map();
let ReqMap = new Map();

function setWorkerSocket(obj){
    workerSocket = obj;
}
function setRenderSocket(obj){
    renderSocket = obj;
}
function setClientMap(key,value){
    ClientMap.set(key,value)
}
function setReqMap(key,value){
    ReqMap.set(key,value)
}

module.exports = {workerSocket,renderSocket,ClientMap,ReqMap};
