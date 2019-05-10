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
client.ws('/socketLux', function (ws, req) {
    ws.on('message',function(data){
        console.log(data);
    })
    //定义事件，向客户端发送数据
    event.on('changeLux', function (data) {
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
        // console.log(data);
        //触发事件，向客户端发送数据
        event.emit('change', data);
        sql.socketLp(data);
    })
})
receive.ws('/lux',function(ws, req){
    ws.on('message',function(data){
        console.log(data);
        event.emit('changeLux',data);
        sql.socketLux(data);
    })
})
//客户端首次连接获取的数据
client.get('/data', function (req, res) {
    sql.getLp(req, res);
})
client.get('/lux',function(req,res){
    sql.getLux(req,res)
})
//监听端口
receive.listen('8081');
client.listen('8082')

