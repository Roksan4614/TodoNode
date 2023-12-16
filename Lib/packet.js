const enums = require('../Scripts/enums');

class PacketBase {
    //protocol = 0;

    constructor(resultCode = "success"){
        this.resultCode = resultCode;
    }

    ToJson() {
        return JSON.stringify(this)
    }
}


module.exports = PacketBase