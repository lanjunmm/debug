import EventHub from '../utils/eventHub'
import {Observer} from '../interfaces/observer'
import {_replace,_unReplace} from '../utils/tools'
import { sendToRender } from '../utils/requestRender'

export default class Jsonp extends EventHub implements Observer{
    constructor(){
        super();
    }
    private hackScriptNode() {
        Object.defineProperty(HTMLScriptElement.prototype, 'src', {
            get: function(){
              return this.src;
            },
            set: function(newValue) {
                this.setAttribute('src',newValue);
            }
        });
        function replaceSetAttribute(originAttribute) {
            return function () {
                let ele = this;
                let mayJsonp = ((ele instanceof Element) && (ele.tagName.toLowerCase() === "script"));
                if (mayJsonp) {
                    let msg = {
                        type: "jsonp",
                        taName: ele.tagName.toLowerCase(),
                        src: arguments[1]
                    };
                    // TODO:转发script标签信息到Render,接收Render的消息
                    sendToRender(msg);
                }
                originAttribute.apply(this,arguments);
            }
        }
        _replace(Element.prototype,'setAttribute',replaceSetAttribute);
    }

    private hackFunc(){
        this.hackScriptNode();
    }
    public install(){
        this.hackFunc();
    }
    public uninstall(){
        _unReplace(document,'setAttribute');
    }
}