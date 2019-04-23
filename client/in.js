var lux = new Chart('lux');
lux.load('亮度','time','luminance','ws://localhost:8082/socketLux');


var testX;
var testY;

function upDate() {
    var socket = new WebSocket('ws://localhost:8082/socketTest');
    socket.addEventListener('open', function (event) {
        console.log('socket is open')
        socket.send('连接到客户端')
    });

    socket.addEventListener('message', function (event) {
        let data = JSON.parse(event.data);
        testX.push(data.time);
        testX.shift();
        testY.push(data.Lp);
        testY.shift();
        myChart.setOption({
            title: {
                text: '声音' + data.Lp
            },
            xAxis: {
                data: testX
            },
            series: [{
                name: 'Lp',
                data: testY
            }]
        });
    });
}

var myChart = echarts.init(document.getElementById('main'));
$.ajax({
    url: '/data',
    type: 'get',
    success(msg) {
        msg = msg.reverse();
        testY = msg.map(item => {
            var temp = item.Lp;
            return temp;
        });
        testX = msg.map(item => {
            // var temp = item.time;
            // return temp;
            var time = new Date(item.time);
            return time.getHours() + '时' + time.getMinutes() + '分' + time.getSeconds() + 's' + time.getMilliseconds() + 'ms'

        })
        myChart.setOption({
            title: {
                text: 'ECharts'
            },
            xAxis: {
                type: "category",
                boundaryGap: false,
                data: testX,
                axisLabel: {//坐标轴刻度标签的相关设置。
                    interval: 50,
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
                data: testY
            }],
            grid: {
                bottom: '30%',
                left: '10%'
            }
        })
        upDate();
    }
})


function upLux() {
    var socket = new WebSocket('ws://localhost:8082/socketLux');
    socket.addEventListener('open', function (event) {
        console.log('socket is open')
        socket.send('连接到客户端')
    });
    socket.addEventListener('close', function (event) {
        console.log('socket is close')
        socket.send('连接到客户端')
    });
    socket.addEventListener('message', function (event) {
        let data = JSON.parse(event.data);
        luxX.push(data.time);
        console.log(data)

        luxX.shift();
        luxY.push(data.luminance);
        luxY.shift();
        chart.setOption({
            title: {
                text: '亮度' + data.luminance
            },
            xAxis: {
                data: luxX,
            },
            series: [{
                name: 'Lux',
                data: luxY
            }]
        });
    });
}

var luxX;
var luxY;
var chart = echarts.init(document.getElementById('lux'));
$.ajax({
    url: '/lux',
    type: 'get',
    success(msg) {
        msg = msg.reverse();
        luxY = msg.map(item => {
            var temp = item.Lux;
            return temp;
        });
        luxX = msg.map(item => {
            // var temp = item.time;
            // return temp;
            var time = new Date(item.time);
            return time.getHours() + '时' + time.getMinutes() + '分' + time.getSeconds() + 's' + time.getMilliseconds() + 'ms'
        })
        chart.setOption({
            title: {
                text: 'ECharts'
            },
            xAxis: {
                type: "category",
                boundaryGap: false,
                data: luxX,
                axisLabel: {
                    interval: 50,
                    rotate: "45",
                },
            },
            yAxis: {
                boundaryGap: [0, '100%'],
                type: 'value'
            },
            series: [{
                name: 'Lux',
                type: 'line',
                smooth: true, //数据光滑过度
                symbol: 'none', //下一个数据点
                stack: 'a',
                areaStyle: {
                    normal: {
                        color: 'blue'
                    }
                },
                data: luxY
            }],
            grid: {
                bottom: '30%',
                left: '10%'
            }
        })
        upLux();
    }
})
