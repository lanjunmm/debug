import httpPlayer from '../palyers/http'
import jsonpPlayer from '../palyers/jsonp'
import Dom from "../palyers/dom";
import {EVENTS} from "../interfaces/types";

class PlayerClass {
    public events:EVENTS={
        move: null,
        click: null,
        attr: null,
        node: Dom.paintNodeAddorRemove,
        text: null,
        form: null,
        resize: Dom.paintResize,
        scroll: Dom.paintScroll,
        dom:Dom,
        jsonp:jsonpPlayer,
        http:httpPlayer,
        default: () => {}
    };
    constructor(){}
}

const Player = new PlayerClass();

export default Player;
