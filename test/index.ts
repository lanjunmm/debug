import Worker from '../src/index'

function testNetwork(){
    let url = 'http://www.mocky.io/v2/5ce3e1d231000062387429e5';
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'text/xml');
    var myInit:RequestInit = { method: 'GET',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default'};
    var myRequest = new Request(url,{method:"Get"});
    fetch(myRequest,myInit).then(function(response) {
        response.json().then(dataJson=>{
            console.log(dataJson)
        })
    });
    fetch(url).then(data=>{
        data.json().then(dataJson=>{
            console.log(dataJson)
        })
    });

    // var xhr = new XMLHttpRequest();
    // xhr.open("get", "htdd");
    // xhr.send(null);
}
function start(){
    document.getElementById('addEle').addEventListener('click', () => {
        let p = document.createElement('p')
        p.appendChild(document.createTextNode('加我一个！'))
        document.getElementById('addedElements').appendChild(p)
    });
    // 发起Jsonp请求
    document.getElementById("reqJson").addEventListener('click',()=>{
        let url="http://www.mocky.io/v2/5cdaa37f300000500068c8c8";
        let ele = document.createElement("script");
        ele.src = url;
        // let attr = document.createAttribute('src');
        // attr.value=url;
        // ele.setAttributeNode(attr);
        // ele["src"]="";
        // for(let i=0;i<ele.attributes.length;i++){
        //     if(ele.attributes[i].name=="src"){
        //         ele.attributes[i].value = "http://www.mocky.io/v2/5cdaa37f300000500068c8c8";
        //     }
        // }
        // ele.setAttribute('src','http://www.mocky.io/v2/5cdaa37f300000500068c8c8');
        document.getElementsByTagName('body')[0].appendChild(ele);
    });
    document.getElementById("reqJson2").addEventListener('click',()=>{
        let url2 = 'http://www.mocky.io/v2/5ce3e1d231000062387429e5';
        let ele = document.createElement("script");
        ele.src = url2;
        document.getElementsByTagName('body')[0].appendChild(ele);
    });

    let worker = new Worker();
    worker.start();
    testNetwork();
}

document.addEventListener('DOMContentLoaded', start);