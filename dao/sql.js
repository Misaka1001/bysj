const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'detection',
    port: '3306',
    multipleStatements: true
});
function getValue(sql, req, res) {
    pool.getConnection((err, connection) => {
        connection.query(sql, (err, result) => {
            res.json(result);
            connection.release();
        })
    })
}
//ajax 请求的数据库操作
// function setValue(sql, req, res) {
//     pool.getConnection((err, connection) => {
//         connection.query(sql, (err, result) => {
//             res.json(result);
//             connection.release();
//         })
//     })
// }

//websocket的数据库操作
function setValue(sql) {
    pool.getConnection((err, connection) => {
        connection.query(sql, (err, result) => {
            connection.release();
        })
    })
}
module.exports = {
    getLp(req, res) {
        const sql = 'SELECT * FROM lp order by id desc limit 0,100;';
        getValue(sql, req, res)
    },
    getLux(req, res) {
        const sql = 'SELECT * FROM lux order by id desc limit 0,100;';
        getValue(sql, req, res)
    },
    upDate(req,res){
        const sql = 'SELECT * FROM Lp order by id desc limit 0,1';
        getValue(sql, req, res)

    },
    socketLp(data) {
        const result = JSON.parse(data);
        const sql = `INSERT INTO Lp VALUES(
            NULL,
            ${result.Lp},
            ${result.time}
        )`
        setValue(sql);
    },
    socketLux(data) {
        const result = JSON.parse(data);
        const sql = `INSERT INTO Lux VALUES(
            NULL,
            ${result.luminance},
            ${result.time}
        )`
        setValue(sql);
    }
}

