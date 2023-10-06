const enums = require('../Scripts/enums');

class PacketBase {
    prtc = 0;
    rc = 0;

    ToJson() {
        if (this.rc != 0)
            this.message = enums.resultCode.GetKey(this.rc)

        return JSON.stringify(this)
    }
}


module.exports = PacketBase