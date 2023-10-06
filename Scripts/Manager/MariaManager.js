const config = require('../config')
const query = require('../../Lib/Maria')

class MariaManager {

    GetData = (_key, _callback) => {
        query(_key, _callback)
    }

    GetUserAuth_Token = (_token, _callback) => {
        query(`SELECT * FROM Account WHERE Token = '${_token}'`, _callback)
    }

    GetUserAuth_AuthCode = (_authCode, _callback) => {
        query(`SELECT * FROM Account WHERE AuthCode = '${_authCode}'`, _callback)
    }

    CreateNewUser = (_callback) => {
        GetRandomAuthCode(_resultAuthCode => {
            query(`INSERT INTO Account (AuthCode, LastLogin) VALUES ('${_authCode}', '${new Date().toUTCString()}')`, _userInfo => {
                console.log('Create new user start :: ', _userInfo)
                _callback(_userInfo)
            })
        })
    }

    SetLogin = (_authCode) => {
        query(`UPDATE Account SET LastLogin='${new Date().toUTCString()}' WHERE AuthCode='${_authCode}'`)
    }

    SetNickname = (_authCode, _nickname) => {
        query(`UPDATE Account SET Nickname='${_nickname}' WHERE AuthCode='${_authCode}'`, _result => {
            console.log(`Nickname Change :: ${_authCode} : ${_nickname}`);
        })
    }

    GetRankingData_Plus = _callback =>{
        query('SELECT * FROM RankingPlus', _rankingData => { _callback(_rankingData) })
    }

    ResultGame_Plus = (_authCode, _point, _correctRate, _dps, _combo, _coin, _callback) => {
        query(`SELECT * FROM RankingPlus WHERE AuthCode = '${_authCode}'`, _rankingInfo => {

            if (_rankingInfo == undefined) {
                query(`INSERT INTO RankingPlus (AuthCode, Point, CorrectRate, Dps, Combo)
                 VALUES (${_authCode}, ${_point}, ${_correctRate}, ${_dps}, ${_combo})`,
                    _newInfo => { _callback(_newInfo) })
            }
            else if (_rankingInfo.Point < _point) {
                query(`UPDATE RankingPlus SET Point = ${_point}, CorrectRate = ${_correctRate}, Dps = ${_dps}, Combo = ${_combo}
                WHERE AuthCode = ${_authCode}`,
                    _newInfo => { _callback(_newInfo) })
            }
            else
                _callback(null)
        })

        query(`UPDATE Account SET Coin=${_coin} WHERE AuthCode=${_authCode}`)
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