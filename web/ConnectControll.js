let express = require('express');
let ws = require('express-ws');
let router = express.Router();
let bodyparser = require('body-parser');
let receive = new express();
let client = new express();

receive.use(express.static('./detection'));
client.use(express.static('./client'));

receive.use(bodyparser.urlencoded({ extended: true }));
receive.use(bodyparser.json())

client.use(bodyparser.urlencoded({ extended: true }));
client.use(bodyparser.json())
ws(client);
ws(receive);
module.exports = {
    client,
    receive
};