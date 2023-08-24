const log = require('./log')

const req_websocket = require('ws')
const req_packet = require('./packet')

class ServerWebSocket {
    port;
    server;

    clients = [];
    closeClient = []
    isSendAllUser = false

    constructor(_port) {
        this.port = _port
        this.Connect()
    }

    Connect = () => {

        this.clients.length = 0
        this.closeClient.length = 0
        this.isSendAllUser = false

        this.server = new req_websocket.Server({ port: this.port })
        log.add_Color('ffff00', `Start Websocket ${this.port}`)

        this.server.on('error', (_error) => {
            log.addError('' + _error)
        })

        this.server.on('close', (_sender) => {
            Onclose(_sender)
        })

        this.server.on('connection', (_ws) => {
            this.clients.push(_ws)

            _ws.on('message', _message => this.OnMessage(_ws, _message))
            _ws.on('close', () => {
                var index = this.clients.indexOf(_ws)

                if (index > -1) {
                    if (this.isSendAllUser == true) {
                        _ws.isDisconnected = true
                        this.closeClient.push(_ws)
                    }
                    else {
                        this.clients.splice(index, 1)
                    }
                }

                _ws = null;
            })
        })
    }

    OnMessage = (_sender, _message) => {
        var data = JSON.parse(_message);
        var protocol = data.protocol

        // 인증일 경우에 값을 넣어주자
        if (protocol == 0)
            _sender.token = data.token
        delete data.protocol

        this.OnReceiveMessage(_sender, protocol, data)
    }

    OnReceiveMessage = (_sender, _protocolType, _data) => { }
    OnClose = (_sender) => { }

    SendAllUser = (_data, _self = undefined) => {
        this.this.isSendAllUser = true

        for (i = 0; i < this.clients.length; i++) {
            if (this.clients[i].isDisconnected == true)
                continue

            if (_self != undefined && this.clients[i].token == _self.token)
                continue
            this.clients[i].send(_data)
        }

        for (i = 0; i < this.closeClient.length; i++)
            this.clients.splice(this.clients.indexOf(this.closeClient[i]), 1)

        log.addReq('Send : ALL', _data)
        this.closeClient.length = 0
        this.isSendAllUser = false
    }

    Send = (_client, _packet, _isLog = true) => {
        var data = JSON.stringify(_packet)

        if (_isLog == true)
            log.addReq('Send : ' + _client.token, data)

        _client.send(data)
    }

    GetPlayerCount = () => { return this.clients.length - this.closeClient.length }

    GetPacket = (_prot, _result = 0) => {
        return new req_packet(_prot, _result)
    }
}

module.exports = ServerWebSocket