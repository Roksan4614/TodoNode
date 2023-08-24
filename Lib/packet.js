class PacketBase{
    protocol;
    result;

    constructor(_protocol, _result){
        this.protocol = _protocol;
        this.result = _result
    }
}


module.exports = PacketBase