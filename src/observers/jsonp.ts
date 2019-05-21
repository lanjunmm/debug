import EventHub from '../utils/eventHub'
import {Observer} from '../interfaces/observer'
import {_replace,_unReplace} from '../utils/tools'
import { sendToRender } from '../utils/requestRender'

export default class Jsonp extends EventHub implements Observer{
    constructor(){
        super();
    }
    private shouldStopScript(nodes){
        nodes=Array.from(nodes);
        nodes = nodes.filter(ele=>{
            let mayJsonp = ((ele instanceof Element)&&(ele.tagName.toLowerCase()==="script")&&(ele.getAttribute("src")));
            if(mayJsonp){
                let msg = {
                    type:"jsonp",
                    taName:ele.tagName.toLowerCase(),
                    attrs : Array.from(ele.attributes)
                };
                // TODO:转发script标签信息到Render,接收Render的消息
                sendToRender(msg);
            }
            return !mayJsonp;
        })
        return nodes;
    }

    //append和prepend方法可以追加几个节点和字符串
    private hackAppend(){
        let that =this;
        function replaceAppend(originAppend) {
            return function () {
                let node = that.shouldStopScript(arguments);
                if(node.length>0){
                    originAppend.apply(this,node);
                }
            }
        }
        _replace(Element.prototype,'append',replaceAppend);
    }
    private hackPrepend(){
        let that = this;
        function replacePrepend(originPrepend) {
            return function () {
                let node = that.shouldStopScript(arguments);
                if(node.length>0){
                    originPrepend.apply(this,node);
                }
            }
        }
        _replace(Element.prototype,'prepend',replacePrepend)
    }
    //appendChild() 只能追加一个节点。
    private hackAppendChild(){
        let that = this;
        function replaceAppendChild(originAppendChild) {
            return function () {
                let node = that.shouldStopScript(arguments);
                if(node.length>0){
                    originAppendChild.apply(this,node);
                }
            }
        }
        _replace(Element.prototype,'appendChild',replaceAppendChild)
    }
    private hackInsertBefore(){
        let that = this;
        function replaceInsertBefore(originInsertBefore) {
            return function () {
                let node = that.shouldStopScript(arguments);
                if(node.length>0){
                    originInsertBefore.apply(this,node);
                }
            }
        }
        _replace(Element.prototype,'insertBefore',replaceInsertBefore)
    }

    private hackFunc(){
        this.hackAppend();
        this.hackAppendChild();
        this.hackInsertBefore();
        this.hackPrepend();
    }
    public install(){
        this.hackFunc();
    }
    public uninstall(){
        _unReplace(Element.prototype,'insertBefore');
        _unReplace(Element.prototype,'appendChild');
        _unReplace(Element.prototype,'prepend');
        _unReplace(Element.prototype,'append');
    }
}