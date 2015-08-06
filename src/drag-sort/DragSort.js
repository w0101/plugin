var DragSort = {
    dragContainer : null,           //可拖拽图标的容器
    effectivePos : [],              //图标可放置的位置数组
    dragable : false,               //可拖拽标识
    mouseOffset : null,             //鼠标坐标相对于拖拽元素左上角的偏移
    dragContainerOffset : null,     //容器相对于浏览器窗口的偏移
    targetCenter : null,            //可拖拽元素中心坐标
    exchangeNode : null,            //可与当前元素交换位置的节点

    Position : function (x, y) {
        this.x = x;
        this.y = y;
    },
    initPos : function () {
        var childLen = this.dragContainer.childNodes.length;
        for (var i = 0; i < childLen; i++){
            if (this.dragContainer.childNodes[i].nodeType === 1) {
                var pos = {};
                pos.x = this.dragContainer.childNodes[i].offsetLeft;
                pos.y = this.dragContainer.childNodes[i].offsetTop;
                pos.node = this.dragContainer.childNodes[i];
                this.effectivePos.push(pos);
            }
        }
    },
    /**
    *利用鼠标位置获取图标位置，
    *因图标位置是相对于容器而定的，
    *因此要减去容器的偏移量
    **/
    getMousePosition : function (event) {
        var mousePosx = event.clientX;
        var mousePosy = event.clientY;
        return new DragSort.Position(mousePosx - DragSort.dragContainerOffset.x,
                                     mousePosy - DragSort.dragContainerOffset.y);
    },
    onmousedown : function (event) {
        var event = event || window.event;
        var target = EventHandler.getTarget(event);
        if (target.nodeName === 'DIV' && target.getAttribute('class').indexOf('inner') >= 0) {
            DragSort.dragable = true;
            DragSort.mouseOffset = EventHandler.getEventPosOffset(event);
            EventHandler.addEventHandler(target, 'mousemove', DragSort.onmousemove);
            EventHandler.addEventHandler(target, 'mouseup', DragSort.onmouseup);
        }
    },
    onmouseup : function (event) {
        var target = EventHandler.getTarget(event);
        target.setAttribute('style', '');
        target.style.cssText = '';
        if (DragSort.exchangeNode && (DragSort.exchangeNode !== target.parentNode)) {
            var node1 = target;
            var node2;
            for (var i = 0, l = DragSort.exchangeNode.childNodes.length; i < l; i++) {
                if (DragSort.exchangeNode.childNodes[i].className.indexOf('inner') >= 0) {
                    node2 = DragSort.exchangeNode.childNodes[i];
                    break;
                }
            }
            target.parentNode.appendChild(node2);
            //target.parentNode.removeChild(node1);
            //DragSort.exchangeNode.removeChild(node2);
            DragSort.exchangeNode.appendChild(node1);

        }
        document.getElementById('prefix').style.display = 'none';
        DragSort.dragable = false;
        DragSort.mouseOffset = null;
        DragSort.targetCenter = null;
        DragSort.exchangeNode = null;
        EventHandler.removeEventHandler(target, 'mousemove', DragSort.onmousemove);
        EventHandler.removeEventHandler(target, 'mouseup', DragSort.onmouseup);
    },
    onmousemove : function (event) {
        if (!DragSort.dragable) {
            return;
        }
        var event = event || window.event;
        var target = EventHandler.getTarget(event);
        var mousePos = DragSort.getMousePosition(event);
        target.style.position = 'absolute';
        target.style.top = (mousePos.y - DragSort.mouseOffset.y) + 'px';
        target.style.left = (mousePos.x - DragSort.mouseOffset.x) + 'px';
        DragSort.targetCenter = new DragSort.Position(mousePos.x - DragSort.mouseOffset.x + 42,
                                                      mousePos.y - DragSort.mouseOffset.y + 42);

        DragSort.findExchangeNode();
    },
    /**
    *鼠标移动过程中根据图标中心点判断图标可放置位置
    **/
    findExchangeNode : function () {
        if (this.targetCenter) {
            for(var i = 0; i < this.effectivePos.length; i++){
                if(this.posInBox(this.targetCenter, this.effectivePos[i].x, this.effectivePos[i].y)) {
                    //console.log("avaible");
                    var node = this.effectivePos[i].node;
                    var prefixNode = document.getElementById('prefix');
                    if (this.exchangeNode !== node) {
                        if (this.exchangeNode) {
                            //var prefixNode = this.exchangeNode.getElementById('prefix');
                            this.exchangeNode.removeChild(prefixNode);
                        }
                        prefixNode.style.display = 'block';
                        node.appendChild(prefixNode);
                        this.exchangeNode = node;
                        break;
                    }
                }
            }
        }
    },
    posInBox : function (pos, boxPosX, boxPosY) {
        if(pos.x >= boxPosX && pos.x <= (boxPosX + 90) &&
           pos.y >= boxPosY && pos.y <= (boxPosY + 84)) {
           return true;
        }
        return false;
    },
    /**
    *获取容器的偏移量
    **/
    getContainerOffset : function () {
        var offsetx = 0;
        var offsety = 0;
        var container = this.dragContainer;
        while(container.offsetParent) {
            offsetx += container.offsetLeft;
            offsety += container.offsetTop;
            container = container.offsetParent;
        }
        return new this.Position(offsetx, offsety);
    },
    init : function (item) {
        if (item) {
            this.dragContainer = document.getElementById(item);
            if (this.dragContainer) {
                this.initPos();
                this.dragContainerOffset = this.getContainerOffset();
                //EventHandler.addEventHandler(this.dragContainer, 'click', this.onclick);
                EventHandler.addEventHandler(this.dragContainer, 'mousedown', this.onmousedown);
            }
            else {
                throw new Error('拖拽排序容器不存在');
            }
        }
    }
}