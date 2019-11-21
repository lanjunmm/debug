
function del_tags(node_list) {
    let Len = node_list.length;
    let nodes = Array.from(node_list);
    for(let i = 0; i < Len; i++){
        let ele = nodes[i];
        ele.parentNode.removeChild(ele);
    }
}

function clearHeadAndBody(){
    //document.body清空
    if(document.body){
        document.body.innerHTML = "";
    }else{
        let body = document.createElement("body");
        document.documentElement.appendChild(body);
    }
    // document.head的css和script标签去掉
    let head_cssTags = document.getElementsByTagName('style');
    del_tags(head_cssTags);
    let head_scriptTags = document.getElementsByTagName('script');
    del_tags(head_scriptTags);

    //加载调试脚本
    let script_tag = document.createElement("script");
    script_tag.src = "http://10.222.225.180:8033/remoteDebug/render.js";
    document.head.appendChild(script_tag);
}

function clearDoc(){
    if((document.readyState === 'uninitialized' || (document.readyState === 'loading'))){
        document.addEventListener('DOMContentLoaded', ()=>{
            clearHeadAndBody();
        });
    } else {
        clearHeadAndBody();
    }
}

function openNewPage() {
    let href = location.href;
    let newWin =  window.open(href); // 阻止弹窗的咋办
    newWin.rd_debug = true;
}

function rd_showButton(){
    //页面上fixed一个icon, 用于唤起新的调试页面
    /**页面的域名保持一致，就有一致的环境，只是url稍微做一点修改？？？把原本的url放到这个html的querystring里面*/
    let fixedBtn = document.createElement('button');
    fixedBtn.innerText = "startDebug";
    fixedBtn.style = "position: fixed; top: 5%; right: 5%;z-index: 10000;width:50px";
    fixedBtn.addEventListener('click',openNewPage);
    if((document.readyState === 'uninitialized' || (document.readyState === 'loading'))){
        document.addEventListener('DOMContentLoaded', ()=>{
            document.body.appendChild(fixedBtn);
        });
    } else {
        document.body.appendChild(fixedBtn);
    }
}

if(window.opener || window.rd_debug){ // 是使用window.opener打开的窗口（即被调试的窗口）
    window.stop(); // 停止加载之后的资源
    clearDoc(); //清除页面上的元素，加载调试脚本
} else{
    window.onerror = function () {
        console.log("window.onerror ");
        rd_showButton();
        return true;
    };

    window.addEventListener('unhandledrejection',function (event) { // 少数浏览器支持
            console.log("promise 错误");
            rd_showButton();
        }
    );

    document.addEventListener('error', function (event) {
        console.log("资源加载错误");
        rd_showButton();
    }, true);
}

decodeURI("x%a");



