const query = require('../../Lib/Maria')

class MariaManager {
    adminAuth = []

    IsAdmin = (_authCode) => {
        return this.adminAuth.length > 0 && this.adminAuth.some(x => x == _authCode) == true
    }

    GetData = (_key, _callback) => {
        query(_key, _callback)
    }

    GetUserAuth_AuthID = (_authID, _callback) => {
        query(`SELECT * FROM Account WHERE AuthID = '${_authID}'`, _callback)
    }

    GetUserAuth_AuthCode = (_authCode, _callback) => {
        query(`SELECT * FROM Account WHERE AuthCode = '${_authCode}'`, _callback)
    }

    GetUserAuth_Nickname = (_nickname, _callback) => {
        query(`SELECT * FROM Account WHERE Nickname = '${_nickname}'`, _callback)
    }

    GetAdmin = (_callback) => {
        query('SELECT * FROM Admin', _admin => { _callback(_admin) })
    }

    CreateNewUser = (_authID, _callback) => {
        GetRandomAuthCode(_authCode => {
            query(`INSERT INTO Account (AuthID, AuthCode, LastLogin) VALUES ('${_authID}','${_authCode}', '${new Date().toUTCString()}')`, _result => {
                if (_result != undefined)
                    this.GetUserAuth_AuthCode(_authCode, _callback);
                else
                    console.log('Create New User :: Failed')
            })
        })
    }

    SetLogin = (_authCode) => {
        query(`UPDATE Account SET LastLogin='${new Date().toUTCString()}' WHERE AuthCode='${_authCode}'`)
    }

    SetNickname = (_authCode, _nickname, _callback) => {
        query(`UPDATE Account SET Nickname='${_nickname}' WHERE AuthCode='${_authCode}'`, _result => {
            _callback(_result)
        })
    }

    GetRankingData_Plus = _callback => {
        query('SELECT * FROM RankingPlus', _rankingData => { _callback(_rankingData) })
    }

    ResultGame_Plus = (_authCode, _point, _correctRate, _dps, _combo, _coin, _callback) => {

        query(`UPDATE Account SET Coin='${_coin}' WHERE AuthCode='${_authCode}'`)

        query(`SELECT * FROM RankingPlus WHERE AuthCode = '${_authCode}'`, _rankingInfo => {

            var isAdmin = this.adminAuth.some(x => x.AuthCode == _authCode) == true;

            if (_rankingInfo != undefined && _rankingInfo.Point < _point) {
                query(`UPDATE RankingPlus SET Point = '${_point}', CorrectRate = '${_correctRate}', Dps = '${_dps}', Combo = '${_combo}'
                WHERE AuthCode = '${_authCode}'`,
                    _newInfo => { _callback(_newInfo) })
            }
            if (_rankingInfo == undefined || isAdmin == true) {
                if (isAdmin == true && _rankingInfo != undefined){
                    _authCode += '_' + parseInt(new Date().toISOString().replace(/\D/g, '').slice(0, 14))
                    _callback(null)
                }

                query(`INSERT INTO RankingPlus (AuthCode, Point, CorrectRate, Dps, Combo)
                VALUES ('${_authCode}', '${_point}', '${_correctRate}', '${_dps}', '${_combo}')`,
                    _newInfo => { if (isAdmin == false) _callback(_newInfo) })
            }
            else
                _callback(null)
        })
    }
}
const maria = new MariaManager()
module.exports = maria

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

maria.GetAdmin(_admin => {
    if (_admin != undefined) {
        if (_admin.AuthID == undefined) {
            for (i = 0; i < _admin.length; i++) {
                maria.adminAuth.push(_admin[i].AuthCode)
            }
        }
        else
            maria.adminAuth.push(_admin.AuthCode)
    }
})
