const enums = require('../Scripts/enums');
const log = require('../Lib/log')

class PacketBase {
    //protocol = 0;

    constructor(resultCode = "success"){
        this.resultCode = resultCode;
    }

    ToJson() {
        return JSON.stringify(this)
    }

    Send(_authCode, _res){
        var jsonData = this.ToJson()
        log.add_Color('333333', '[SEND]: ', _authCode,  jsonData)
        _res.send(jsonData)
    }
}


module.exports = PacketBase