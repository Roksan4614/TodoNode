class PacketBase{
    prtc = 0;
    rc = 0;

    constructor(_protocol, _result){
        this.prtc = _protocol;
        this.rc = _result
    }
}


module.exports = PacketBase