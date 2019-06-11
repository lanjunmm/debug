const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);

const port = 3000;

let workerSocket=null;
let renderSocket=null;
let ClientMap = new Map();
let ReqMap = new Map();
let firtstSnapshot = null;
const WorkerEvents = require('./events');

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
    //交换id和身份信息
    ClientMap.set(socket.id,socket);
    socket.emit("id",socket.id);

    // worker和render没有重复的监听事件，故可以监听每个事件，若等到id交换完毕则会错过某些事件
    workerMsg(socket);
    renderMsg(socket);

    socket.on("id",function (data) {
        if(data.name==="worker"){
            workerSocket=socket;
            // workerMsg(ClientMap.get(data.id));
        }else if(data.name==="render"){
            renderSocket = socket;
            if(firtstSnapshot!=null){
                renderSocket.emit('snapshot',firtstSnapshot);
                firtstSnapshot=null;
            }
            // renderMsg(ClientMap.get(data.id));
        }
    });
});


function workerMsg(socket) {
    // workerSocket=socket;

   // let EventsName = Object.keys(Events);
   // EventsName.forEach(name=>{
   //     workerSocket.on(Events[name], function(data) {
   //         console.log(name);
   //         if(renderSocket!=null){
   //             renderSocket.emit(Events[name],data);
   //             if(Events[name]!=='jsonp'){
   //                 workerSocket.emit(Events[name],name);
   //             }
   //         }else {
   //             workerSocket.emit(Events[name],"render is not exist!");
   //         }
   //
   //     });
   // });

    socket.on(WorkerEvents.jsonp, function(data) {
        renderSocket.emit('jsonp',data);
    });
    socket.on(WorkerEvents.event, function(data) {
        renderSocket.emit('event', data);
        // workerSocket.emit('event', data.type || "a event response msg from server");
    });
    socket.on(WorkerEvents.mutation, function(data) {
        // console.log('mutation');
        renderSocket.emit('mutation', data);
        // workerSocket.emit('mutation', data.type || "a mutation response msg from server");
    });
    socket.on(WorkerEvents.snapshot, function(data) {
        // renderSocket.emit('snapshot',data);
        if(renderSocket!=null){
            renderSocket.emit('snapshot',data);
        }else {
            firtstSnapshot = data;
        }
        // console.log('snapshot');
        // workerSocket.emit('snapshot', data.type || "a snapshot response msg from server");
    });
    socket.on(WorkerEvents.mouse, function(data) {
        renderSocket.emit('mouse', data);
        // workerSocket.emit('mouse', data.type || "a mouse response msg from server");
    });
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
    // renderSocket = socket;
    socket.on("fetch",function (fetchRes) {
        let reseponseObj = ReqMap.get(fetchRes.reqId);
        fetchReseponse(reseponseObj,fetchRes);
    });
    socket.on("xhr",function (xhrRes) {
        let reseponseObj = ReqMap.get(xhrRes.reqId);
        xhrReseponse(reseponseObj,xhrRes);
    });
    socket.on("beacon",function (beaconRes) {
        let reseponseObj = ReqMap.get(beaconRes.reqId);
        beaconResponse(reseponseObj,beaconRes);
    });
    socket.on('jsonp',function (jsonpRes) {
        workerSocket.emit(WorkerEvents.jsonp, jsonpRes);
    });
}
