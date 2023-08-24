"Server main websocket"

const log = require('../../Lib/log')
const req_websocket = require('../../Lib/websocket')
const config = require('../config')

const websocket = new req_websocket(config.PORT_WEBSOCKET_MAIN)
console.log("Server main websocket")
class WebsocketManager{
    constructor(){
        console.log("Server main websocket :: constructor")
    }

    Connect(){
        console.log("Connect")
    }
}

module.exports = new WebsocketManager()