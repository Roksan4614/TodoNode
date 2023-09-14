const config = require('./config')
const query = require('../Lib/Maria')

class MariaManager {

    GetUserAuth_Token = (_token, _callback) => {
        GetData(`SELECT * FROM Account WHERE Token = '${_token}'`, _callback)
    }

    GetUserAuth_AuthCode = (_authCode, _callback) => {
        GetData(`SELECT * FROM Account WHERE AuthCode = '${_authCode}'`, _callback)
    }

    CreateNewUser = (_authCode, _callback) => {
        GetRandomAuthCode(_resultAuthCode => {

            query(`INSERT INTO \`Account\` (\`AuthCode\`, \`LastLogin\`) VALUES ('${_authCode}', '${new Date().toUTCString()}')`, _result => {

                this.GetUserAuth_AuthCode(_resultAuthCode, _resultUserAuth => {
                    _callback(_resultUserAuth)
                    console.log('Create new user start :: ', _resultAuthCode, _resultUserAuth)

                    let authCode = _resultUserAuth['AuthCode']
                    //query(`INSERT INTO \`userdata\` (\`AuthCode\`, \`Nickname\`) VALUES ('${authCode}', '${GetRandomNickname()}')`, _result => { })
                });
            })
        })
    }

    SetLogin = (_authCode) => {
        query(`UPDATE \`userauth\` SET \`LastLogin\`='${new Date().toUTCString()}' WHERE \`AuthCode\`='${_authCode}'`, _result => {
            //console.log('SetLogin Result :: ', _result)
        })
    }

    GetRandomAuthCode = (_callback)=>{
        GetRandomAuthCode(_callback);
    }
}
const maria = new MariaManager()
module.exports = maria

function GetData(_key, _callback) {
    query(_key, _result => {
        console.log('result', _result)
        _callback(_result == undefined ? null : _result)
    })
}

function GetRandomAuthCode(_callback) {
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    segments = []

    for (i = 0; i < 4; i++) {
        segment = ''

        for (let j = 0; j < 4; j++) {
            randomIndex = Math.floor(Math.random() * characters.length)
            segment += characters.charAt(randomIndex)
        }

        segments.push(segment)
    }

    authCode = segments.join('-')

    maria.GetUserAuth_AuthCode(authCode, _result => {
        if (_result != undefined)
            GetRandomAuthCode(_callback)
        else
            _callback(authCode)
    })
}

function GetRandomNickname() {
    nickTable = require('../TABLE/nickTable')

    indexPrev = Math.floor(nickTable.prev.length * Math.random())
    indexNext = Math.floor(nickTable.next.length * Math.random())

    language = 0
    if (config.LANGUAGE == "en")
        language = 1

    return `${nickTable.prev[indexPrev][language]}${nickTable.next[indexNext][language]}`
}