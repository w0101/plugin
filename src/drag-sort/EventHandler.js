var EventHandler = {
    addEventHandler : function (ele, type, callback) {
        if (ele.addEventListener) {
            ele.addEventListener(type, callback, false);
        }
        else if (ele.attachEvent) {
            ele.attachEvent('on' + type, callback);
        }
        else {
            var eventType = 'on' + type;
            ele.eventType = callback;
        }
    },
    removeEventHandler : function(ele, type, callback) {
        if(ele.removeEventListener) {
            ele.removeEventListener(type,callback);
        }
        else if(ele.detachEvent) {
            ele.detachEvent('on' + type, callback);
        }
        else {
            var eventType = 'on' + type;
            ele.eventType = null;
        }
    },
    getTarget : function (e) {
        e = e || window.event;
        if (e.target) {
            return e.target;
        }
        return e.srcElement;
    },
    getEventPosOffset : function (evt) {
        var srcObj = evt.target || evt.srcElement;
        if (evt.offsetX){
            return {x: evt.offsetX,
                    y: evt.offsetY
                }
        }else{
            var x = 0;
            var y = 0;
            var ele = srcObj;
            while (ele.offsetParent) {
                x += ele.offsetLeft;
                y += ele.offsetTop;
                ele = ele.offsetParent;
            }
            return {x : evt.clientX - x,
                    y : evt.clientY - y
                }
        }
    }
}