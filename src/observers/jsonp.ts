import EventHub from '../utils/eventHub'
import {Observer,JSONPArguments} from '../interfaces/observer'
import {_replace,_unReplace} from '../utils/tools'
import { sendToServer } from '../utils/requestServer'

export default class Jsonp extends EventHub implements Observer{
    constructor(){
        super();
    }
    private hackCreateElement() {
        let replaceCreateElement = (originalFunc)=>{
            return (tagName: string, options?: ElementCreationOptions): HTMLElement=>{
                let element = originalFunc.apply(document,[tagName,options]);
                if (tagName.toLowerCase() === 'script') {
                    this.hackScriptNode(element);
                }
                return element;
            }
        };
        _replace(document,'createElement',replaceCreateElement);
    }
    private hackScriptNode(element) {
        function replaceSetAttribute(originAttribute) {
            return function () : void{
                let ele = this;
                let mayJsonp = ((ele instanceof Element) && (ele.tagName.toLowerCase() === "script")&&(arguments[0]==="src"));
                if (mayJsonp) {
                    let msg:JSONPArguments = {
                        type: "jsonp",
                        taName: ele.tagName.toLowerCase(),
                        src: arguments[1]
                    };
                    // socket: 转发script标签信息到Render,接收Render的消息
                    sendToServer('jsonp',msg).then(data=>{
                        console.log("jsonp收到Server：",data);
                    });
                }else {
                    originAttribute.apply(this,arguments);
                }
            }
        }
        _replace(element,'setAttribute',replaceSetAttribute); // element.__proto__ ---> element

        let src=undefined;
        Object.defineProperty(element, 'src', {
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
        _replace(element,'setAttributeNode',replaceSetAttibuteNode);

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