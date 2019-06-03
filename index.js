const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);

const port = 3000;

let workerSocket=null;
let renderSocket=null;
let ClientMap = new Map();
let ReqMap = new Map();

app.use(express.static(path.join(__dirname, 'public')));
app.use("*", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next()
    }
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


app.get('/testifr', function(req, res) {
    res.render('testIframe.html');
});
app.get('/testIfrReq', function(req, res) {
    res.send("iframeRes");
});
app.get('/tranfer', function(req, res) {
    console.log('get:');
    res.send('.');
});

app.post('/fetch',function (req,res) {
    console.log('fetch');
    req.on("data",(data)=>{
        data = JSON.parse(data);
        ReqMap.set(data.reqId,res);
        if(renderSocket!=null){
            renderSocket.emit("fetch",data);
        }
    })
})
app.post('/xhr',function (req,res) {
    console.log('xhr');
    req.on("data",(data)=>{
        data = JSON.parse(data);
        ReqMap.set(data.reqId,res);
        if(renderSocket!=null){
            renderSocket.emit("xhr",data);
        }
    })
})
app.post('/beacon',function (req,res) {
    console.log('beacon');
    req.on("data",(data)=>{
        data = JSON.parse(data);
        ReqMap.set(data.reqId,res);
        if(renderSocket!=null){
            renderSocket.emit("beacon",data);
        }
    })
})

http.listen(port, function() {
    console.log(`listening on port:${port}`);
});

const io = require('socket.io')(http,{transports:['polling','websocket']});//'polling'

io.on('connection', function(socket) {
    console.log('a user connected');
    ClientMap.set(socket.id,socket);
    socket.emit("id",socket.id);

    socket.on("id",function (data) {
        if(data.name==="worker"){
            workerMsg(ClientMap.get(data.id));
        }else if(data.name==="render"){
            renderMsg(ClientMap.get(data.id));
        }
    });
});

function workerMsg(socket) {
    workerSocket=socket;
    workerSocket.on('message', function(data) {
        console.log('Client-message: ',data);
    });
    workerSocket.on('jsonp', function(data) {
        renderSocket.emit('jsonp',data);
    });
    workerSocket.on('event', function(data) {
        workerSocket.emit('event', data.type || "a event response msg from server");
    });
    workerSocket.on('mutation', function(data) {
        workerSocket.emit('mutation', data.type || "a mutation response msg from server");
    });
    workerSocket.on('snapshot', function(data) {
        workerSocket.emit('snapshot', data.type || "a snapshot response msg from server");
    });
    workerSocket.on('mouse', function(data) {
        workerSocket.emit('mouse', data.type || "a mouse response msg from server");
    });
    // workerSocket.on('network', function(data) {
    //     console.log('Client-network: ',data.type || data);
    //     if(!!data.type && data.type==="network"){
    //         workerSocket.emit('network', {id:data.reqId} || "a msg from server");
    //     }else{
    //         workerSocket.emit('network', data.type || "a msg from server");
    //     }
    // })
}

function fetchReseponse(reseponseObj,resData) {
    if(reseponseObj!=null){
        reseponseObj.status(resData.data.status);
        reseponseObj.send(resData.data.body); //返回响应体
        ReqMap.set(resData.reqId,null);
    }
}
function xhrReseponse(reseponseObj,resData) {
    if(reseponseObj!=null){
        // reseponseObj.type = resData.data.responseType;
        reseponseObj.status(resData.data.status);
        reseponseObj.send(resData.data.response); //返回响应体
        ReqMap.set(resData.reqId,null);
    }
}
function beaconResponse(reseponseObj,resData) {
    if(reseponseObj!=null){
        reseponseObj.send(resData);
        ReqMap.set(resData.reqId,null);
    }
}

function renderMsg(socket) {
    renderSocket = socket;
    renderSocket.on("fetch",function (fetchRes) {
        let reseponseObj = ReqMap.get(fetchRes.reqId);
        fetchReseponse(reseponseObj,fetchRes);
    });
    renderSocket.on("xhr",function (xhrRes) {
        let reseponseObj = ReqMap.get(xhrRes.reqId);
        xhrReseponse(reseponseObj,xhrRes);
    });
    renderSocket.on("beacon",function (beaconRes) {
        let reseponseObj = ReqMap.get(beaconRes.reqId);
        beaconResponse(reseponseObj,beaconRes);
    });
    renderSocket.on('jsonp',function (jsonpRes) {
        workerSocket.emit('jsonp', jsonpRes);
    });
}
