const enums = require('../Scripts/enums');
const log = require('../Lib/log')

class PacketBase {
    //protocol = 0;

    constructor(resultCode = "success") {
        this.resultCode = resultCode;
    }

    ToJson() {
        return JSON.stringify(this)
    }

    Send(_url, _authCode, _res, _isLog = true) {
        var jsonData = this.ToJson()

        if (_isLog == true)
            log.add_Color('333333', `[SEND] ${_url}:`, _authCode, jsonData)

        _res.send(jsonData)
    }
}


module.exports = PacketBase