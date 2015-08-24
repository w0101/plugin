var CountDown = (function () {
    var _Color = ['#F97E7E', '#F526D6', '#BC2CF8', '#872BF9', '#4527F8', '#30B7FA', '#35F3F1', '#2FFA79', '#BDF92B', '#F5E228', '#FE8C31'];
    var _drawTime = function (startX, startY, time, circleSize, ctx) {
        for (var i = 0; i < time.length; i++) {
            if (time[i] === ':') {
                _drawDigit(startX, startY, 10, circleSize, ctx);
                startX += (circleSize + 1) * 9;
            }
            else {
                _drawDigit(startX, startY, parseInt(time[i]), circleSize, ctx);
                startX += (circleSize + 1) * 15;
            }
        }
    };
    var _drawDigit = function (x, y, num, circleSize, ctx) {
        for (var i = 0; i < digit[num].length; i++) {
            for (var j = 0; j < digit[num][i].length; j++) {
                if (digit[num][i][j] === 1) {
                    ctx.beginPath();
                    ctx.fillStyle = '#4346E6';
                    var centerX = x + circleSize + 1 + j * (circleSize + 1) * 2;
                    var centerY = y + circleSize + 1 + i * (circleSize + 1) * 2;
                    ctx.arc(centerX, centerY, circleSize, 0, 2*Math.PI);
                    ctx.closePath();
                    ctx.fill();
                }
            }
        }
    };
    var _addBalls = function (x, y, num, circleSize, balls) {
        for (var i = 0; i < digit[num].length; i++) {
            for (var j = 0; j < digit[num][i].length; j++) {
                if (digit[num][i][j] === 1) {
                    var centerX = x + circleSize + 1 + j * (circleSize + 1) * 2;
                    var centerY = y + circleSize + 1 + i * (circleSize + 1) * 2;
                    balls.push({
                        x : centerX,
                        y : centerY,
                        r : circleSize,
                        g : 2 + Math.random(),
                        vx : Math.pow(-1, Math.ceil(Math.random()*1000)) * 8,
                        vy : -5,
                        color : _Color[Math.floor(Math.random()*_Color.length)]
                    })
                }
            }
        }
    }
    //添加一个速度方向随机，没有重力的小球
    var _addBallsEveryData = function (x, y, num, circleSize, balls) {
        for (var i = 0; i < digit[num].length; i++) {
            for (var j = 0; j < digit[num][i].length; j++) {
                if (digit[num][i][j] === 1) {
                    var centerX = x + circleSize + 1 + j * (circleSize + 1) * 2;
                    var centerY = y + circleSize + 1 + i * (circleSize + 1) * 2;
                    balls.push({
                        x : centerX,
                        y : centerY,
                        r : circleSize,
                        g : 0,
                        vx : Math.pow(-1, Math.ceil(Math.random()*1000)) * 8,
                        vy : Math.pow(-1, Math.ceil(Math.random()*1000)) * 8,
                        color : _Color[Math.floor(Math.random()*_Color.length)]
                    })
                }
            }
        }
    }
    var _getTime = function (endTime) {
        var curTime = new Date();
        var timeDis = Math.round((endTime.getTime() - curTime.getTime())/1000);
        timeDis = timeDis > 0 ? timeDis : 0;
        var hour = parseInt(timeDis / 3600);
        var minute = parseInt((timeDis - hour * 3600)/60);
        var second = parseInt(timeDis%60);
        var time = '' + (hour.toString().length < 2 ? '0' + hour : hour) + ':'
                      + (minute.toString().length < 2 ? '0' + minute : minute) + ':'
                      + (second.toString().length < 2 ? '0' + second : second);
        return time;
    };

    var CountDown = function () {};
    CountDown.prototype.init = function (config) {
        this.circleSize = config.circleSize || 8;
        this.width = config.width || 1024;
        this.height = config.height || 600;
        this.startX = config.startX || 30;
        this.startY = config.startY || 60;
        this.endTime = config.endTime;
        var canvas = document.getElementById(config.canvas);
        canvas.width = this.width;
        canvas.height = this.height;
        this.ctx = canvas.getContext('2d');
        this.curTime = _getTime(this.endTime);
        this.balls = [];
        this.mu = config.mu || 0.7;
        this.firstTime = true;
        this.start();

    };
    CountDown.prototype.render = function () {
        this.ctx.clearRect(0, 0, this.width, this.height);
        _drawTime(this.startX, this.startY, this.curTime, this.circleSize, this.ctx);

        for (var i = 0; i < this.balls.length; i++) {
            this.ctx.beginPath();
            this.ctx.arc(this.balls[i].x, this.balls[i].y, this.balls[i].r, 0, 2*Math.PI);
            this.ctx.fillStyle = this.balls[i].color;
            this.ctx.fill();
        }
    }
    CountDown.prototype.update = function () {
        var nextTime = _getTime(this.endTime);
        if (nextTime === '00:00:00') {
            this.curTime = nextTime;
            this.enterSpace(this.firstTime);
            this.firstTime = false;
            return;
        }
        for (var i = 0; i < this.balls.length; i++) {
            if (this.balls[i].y + this.balls[i].r >= this.ctx.canvas.height){
                this.balls[i].vy = -this.balls[i].vy * this.mu;
                this.balls[i].y = this.ctx.canvas.height - this.balls[i].r;
            }
            this.balls[i].x += this.balls[i].vx;
            this.balls[i].y += this.balls[i].vy;
            this.balls[i].vy += this.balls[i].g;
        }
        var cont = 0;
        var length = this.balls.length;
        for (var i = 0; i < length; i++) {
            if (this.balls[i].x + this.circleSize > 0 && this.balls[i].x - this.circleSize < this.width) {
                this.balls[cont++] = this.balls[i];
            }
        }
        while (cont < this.balls.length) {
            this.balls.pop();
        }
        if (nextTime !== this.curTime) {
            var oldTime = this.curTime;
            this.curTime = nextTime;
            var startX = this.startX;
            var startY = this.startY;
            for (var i = 0; i < this.curTime.length; i++) {
                if (oldTime[i] !== this.curTime[i]) {
                    _addBalls(startX, startY, parseInt(this.curTime[i]),this.circleSize, this.balls);
                }
                if (this.curTime[i] === ':') {
                    startX += (this.circleSize + 1) * 9;
                }
                else {
                    startX += (this.circleSize + 1) * 15;
                }
            }
        }
    }
    //倒计时结束的狂欢~
    CountDown.prototype.enterSpace = function (firstTime) {
        if (firstTime) {
            var startX = this.startX;
            var startY = this.startY;
            for (var i = 0; i < this.curTime.length; i++) {
                if(this.curTime[i] !== ':') {
                    _addBallsEveryData(startX, startY, parseInt(this.curTime[i]),this.circleSize, this.balls);
                }
                if (this.curTime[i] === ':') {
                    startX += (this.circleSize + 1) * 9;
                }
                else {
                    startX += (this.circleSize + 1) * 15;
                }
            }
        }
        for (var i = 0; i < this.balls.length; i++) {
            if (this.balls[i].y + this.balls[i].r >= this.ctx.canvas.height){
                this.balls[i].vy = -this.balls[i].vy;
                this.balls[i].y = this.ctx.canvas.height - this.balls[i].r;
            }
            if (this.balls[i].y - this.balls[i].r <= 0){
                this.balls[i].vy = -this.balls[i].vy;
                this.balls[i].y = this.balls[i].r;
            }
            if (this.balls[i].x + this.balls[i].r >= this.ctx.canvas.width){
                this.balls[i].vx = -this.balls[i].vx;
                this.balls[i].x = this.ctx.canvas.width - this.balls[i].r;
            }
            if (this.balls[i].x - this.balls[i].r <= 0){
                this.balls[i].vx = -this.balls[i].vx;
                this.balls[i].x = this.balls[i].r;
            }
            this.balls[i].x += this.balls[i].vx;
            this.balls[i].y += this.balls[i].vy;
        }

    }
    CountDown.prototype.start = function () {
        var self = this;
        return setInterval(function () {
                self.render();//渲染
                self.update();//数据更新

            }, 50);
    }
    return CountDown;
})();