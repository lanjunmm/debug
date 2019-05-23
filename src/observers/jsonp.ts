import EventHub from '../utils/eventHub'
import {Observer} from '../interfaces/observer'
import {_replace,_unReplace} from '../utils/tools'
import { sendToRender } from '../utils/requestRender'

export default class Jsonp extends EventHub implements Observer{
    constructor(){
        super();
    }
    private hackCreateElement() {
        let replaceCreateElement = (originalFunc)=>{
            return (tag)=>{
                let element = originalFunc.call(document, tag);
                if (tag.toLowerCase() === 'script') {
                    this.hackScriptNode(element);
                }
                return element;
            }
        }
        _replace(document,'createElement',replaceCreateElement);
    }
    private hackScriptNode(element) {
        function replaceSetAttribute(originAttribute) {
            return function () {
                let ele = this;
                let mayJsonp = ((ele instanceof Element) && (ele.tagName.toLowerCase() === "script")&&(arguments[0]==="src"));
                if (mayJsonp) {
                    let msg = {
                        type: "jsonp",
                        taName: ele.tagName.toLowerCase(),
                        src: arguments[1]
                    };
                    // TODO:转发script标签信息到Render,接收Render的消息
                    sendToRender(msg);
                    // originAttribute.apply(this,arguments);
                }else {
                    originAttribute.apply(this,arguments);
                }
            }
        }
        _replace(element.__proto__,'setAttribute',replaceSetAttribute);

        let src=undefined;
        Object.defineProperty(element.__proto__, 'src', {
            get: function(){
                return src;
            },
            set: function(newValue) {
                src = newValue;
                this.setAttribute('src',newValue);
            }
        });

        function replaceSetAttibuteNode(originSetAttributeNode) {
            return function(attr:Attr){
                let ele = this;
                let mayJsonp = ((ele instanceof Element) && (ele.tagName.toLowerCase() === "script")&&(attr.name === "src"));
                if(mayJsonp){
                    ele.setAttribute('src',attr.value);
                }else{
                    originSetAttributeNode.apply(this,arguments);
                }
            }
        }
        _replace(element.__proto__,'setAttributeNode',replaceSetAttibuteNode);

        //TODO: element.attributes属性,以及setNamedItem
    }

    private hackFunc(){
        this.hackCreateElement();
    }
    public install(){
        this.hackFunc();
    }
    public uninstall(){
        _unReplace(document,'setAttribute');
    }
}