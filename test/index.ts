import Worker from '../src/index'


function start(){
    document.getElementById('addEle').addEventListener('click', () => {
        let p = document.createElement('p')
        p.appendChild(document.createTextNode('加我一个！'))
        document.getElementById('addedElements').appendChild(p)
    });
    document.getElementById("reqJson").addEventListener('click',()=>{
        let ele = document.createElement("script");
        ele.src="http://www.mocky.io/v2/5cdaa37f300000500068c8c8";
        ele.addEventListener('error',function (e) {
            console.log(e)
        })
        document.getElementsByTagName('body')[0].appendChild(ele);
    });
    let worker = new Worker();
    worker.start();
}

document.addEventListener('DOMContentLoaded', start);