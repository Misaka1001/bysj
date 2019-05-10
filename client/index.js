class Chart {
    constructor(id,ws,title,propX,propY) {
        this.X;
        this.Y;
        this.propX = propX;
        this.propY = propY;
        this.chart = echarts.init(document.getElementById(id));
        this.ws = ws;
        this.title = title;
    };
    upDate() {
        var socket = new WebSocket(this.ws);
        socket.addEventListener('open', function (event) {
            console.log('socket is open')
            socket.send('连接到客户端')
        });
        socket.addEventListener('message',  (event) => {
            let data = JSON.parse(event.data);
            let X = this.X;
            let Y = this.Y;
            let title = this.title;
            let time = new Date(data[this.propX]);
            time = time.getHours() + '时' + time.getMinutes() + '分' + time.getSeconds() + 's' 
            X.push(time);
            X.shift();
            Y.push(data[this.propY]);
            Y.shift();
            this.chart.setOption({
                title: {
                    text: title + data[this.propY]
                },
                xAxis: {
                    data: X
                },
                series: [{
                    name: title,
                    data: Y
                }]
            });
        });
    };
    load(url) {
        $.ajax({
            url: url,
            type: 'get',
            success : (msg) => {
                msg = msg.reverse();
                this.Y = msg.map(item => {
                    var temp = item[this.propY];
                    return temp;
                });
                this.X = msg.map(item => {
                    var time = new Date(item[this.propX]);
                    return time.getHours() + '时' + time.getMinutes() + '分' + time.getSeconds() + 's'

                })
                this.chart.setOption({
                    title: {
                        text: this.title
                    },
                    xAxis: {
                        type: "category",
                        boundaryGap: false,
                        data: this.X,
                        axisLabel: {//坐标轴刻度标签的相关设置。
                            interval: 5,
                            rotate: "45",
                        },
                    },
                    yAxis: {
                        boundaryGap: [0, '100%'],
                        type: 'value'
                    },
                    series: [{
                        name: 'Lp',
                        type: 'line',
                        smooth: true, //数据光滑过度
                        symbol: 'none', //下一个数据点
                        stack: 'a',
                        areaStyle: {
                            normal: {
                                color: 'red'
                            }
                        },
                        data: this.Y
                    }],
                    grid: {
                        bottom: '30%',
                        left: '20%'
                    }
                })
                console.log(this.X,this.Y)
                this.upDate();
            }
        })
    }
}
var lp = new Chart('db','ws://localhost:8082/socketTest', '声音','time','Lp');
lp.load('/data');

var lux = new Chart('lux','ws://localhost:8082/socketLux','亮度','time','luminance')
lux.load('lux');