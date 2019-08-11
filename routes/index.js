var express = require('express');
var router = express.Router();
let {workerSocket,renderSocket,ReqMap} =require('../src/socketObj')


router.get('/testifr', function(req, res) {
    res.render('testIframe.html');
});
router.get('/testIfrReq', function(req, res) {
    res.send("iframeRes");
});
router.get('/tranfer', function(req, res) {
    console.log('get:');
    res.send('.');
});

router.post('/fetch',function (req,res) {
    console.log('fetch');
    req.on("data",(data)=>{
        data = JSON.parse(data);
        ReqMap.set(data.reqId,res);
        if(renderSocket!=null){
            renderSocket.emit("fetch",data);
        }
    })
})
router.post('/xhr',function (req,res) {
    console.log('xhr');
    req.on("data",(data)=>{
        data = JSON.parse(data);
        ReqMap.set(data.reqId,res);
        if(renderSocket!=null){
            renderSocket.emit("xhr",data);
        }
    })
})
router.post('/beacon',function (req,res) {
    console.log('beacon');
    req.on("data",(data)=>{
        data = JSON.parse(data);
        ReqMap.set(data.reqId,res);
        if(renderSocket!=null){
            renderSocket.emit("beacon",data);
        }
    })
})

module.exports = router;
