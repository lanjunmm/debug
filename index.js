const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);

const port = 3000;

let Socket=null;

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
app.get('/tranfer', function(req, res) {
    console.log('get:');
    res.send('.');
});

app.post('/network', function(req, res) {
    console.log('post');
    req.on("data",(data)=>{
        // Socket.emit("message","mock response")
        res.send('xhr response');
    })
});

http.listen(port, function() {
    console.log(`listening on port:${port}`);
});

const io = require('socket.io')(http,{transports:['polling','websocket']});//'polling'

io.on('connection', function(socket) {
    Socket=socket;
    console.log('a user connected');
    socket.emit("message","测试Emit");
    socket.on('message', function(data) {
        console.log('Client-message: ',data);
    });
    socket.on('jsonp', function(data) {
        socket.emit('jsonp', data.type || "a jsonp response msg from server");
    });
    socket.on('event', function(data) {
        socket.emit('event', data.type || "a event response msg from server");
    });
    socket.on('mutation', function(data) {
        socket.emit('mutation', data.type || "a mutation response msg from server");
    });
    // socket.on('network', function(data) {
    //     console.log('Client-network: ',data.type || data);
    //     if(!!data.type && data.type==="network"){
    //         socket.emit('network', {id:data.reqId} || "a msg from server");
    //     }else{
    //         socket.emit('network', data.type || "a msg from server");
    //     }
    // })
})