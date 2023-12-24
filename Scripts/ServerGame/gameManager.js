const log = require('../Lib/log')
const config = require('../config')
const enums = require('../enums')
const req_websocket = require('../Lib/websocket')

const websocket = new req_websocket(config.PORT_LOBBY)

var server_main = undefined;
websocket.OnReceiveMessage = (_sender, _protocolType, _data) => {

    key = enums.protocolType.GetKey(_protocolType)

    if (_protocolType != enums.protocolType.authenticate)
        log.addRecv(key + ' ' + _sender.token, _data)

    switch (_protocolType) {
        case enums.protocolType.authenticate.index:
            var packet = websocket.GetPacket(_protocolType);

            if (IsServer(_sender) == false) {
                log.add(`Join ${_sender.token}`)
                websocket.Send(_sender, packet, false)
            }
            else if (_sender.token == 'server_main')
                server_main = _sender
            break;
    }
}

function IsServer(_sender) {
    return _sender.token.includes('server')
}

websocket.OnClose = (_sender) => {


}
