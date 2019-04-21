let connect = require('./web/ConnectControll');
let sql = require('./dao/sql.js');
let Events = require('events');
let event = new Events();
receive = connect.receive;
client = connect.client;

//与客户端进行websocket连接
client.ws('/socketTest', function (ws, req) {
    ws.on('message',function(data){
        console.log(data);
    })
    //定义事件，向客户端发送数据
    event.on('change', function (data) {
        //判断连接状态 防止报错
        if (ws.readyState === 3) {
            return
        } else {
            ws.send(data);
        }
    })
})
//与测量端进行websocket连接
receive.ws('/msg',function(ws, req){
    ws.on('message',function(data){
        console.log(data);
        //触发事件，向客户端发送数据
        event.emit('change', data);
        sql.socketLp(data);
    })
})

//接收ajax方式发送的数据
// receive.post('/data', function (req, res) {
//     event.emit('change', req.body);
//     // console.log(req.body);
//     sql.setLp(req, res);
// })

//客户端首次连接获取的数据
client.get('/data', function (req, res) {
    sql.getLp(req, res);
})

//监听端口
receive.listen('8081');
client.listen('8082')