//#region 
class EnumBase {
    GetKey = _index => {
        for (const key in this) {
            if (this[key].index != undefined && this[key].index == 0)
                return key;
        }
        return 'none'
    }
    SetKey = (_class) => {
        var index = 0
        for (const key in _class) {
            if (this[key] == undefined) {
                _class[key] = new EnumItem(key, index++)
            }
        }
    }
}

class EnumItem {
    index;
    key;

    constructor(_key, _index) {
        this.index = _index
        this.key = _key
    }

    toString() {
        return this.index; // index 값을 반환하도록 수정
    }
}
//#endregion

class EnumManager {
    protocolType = new EnumProtocolType()
    resultCode = new EnumResultCode()
}

class EnumProtocolType extends EnumBase {
    Authenticate

    constructor() {
        super()
        this.SetKey(this)
    }
}

class EnumResultCode extends EnumBase {
    Success
    Failed
    UserNotFind
    
    constructor() {
        super()
        this.SetKey(this)
    }
}

module.exports = new EnumManager()
