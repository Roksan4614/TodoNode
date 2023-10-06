//#region Initialize
const mariaDB = require('../Manager/MariaManager')
const log = require('../../Lib/log')
const { express } = require('../../Lib/http')
const { NextFunction, Request, Response, Router } = require('express');
const req_packet = require('../../Lib/packet')
const enums = require('../enums');

const clients = []
const router = Router()
module.exports = router

express.use('/plus', require('./Router/Game_Plus'))

router.all('/*', (_req, _res, _next) => {
    const authCode = _req.headers['authorization']
    if (authCode == undefined)
        return;
    _req.authCode = authCode

    if (Object.keys(_req.query).length == 0)
        log.add_Color('333333', `[RECV] ${_req.params[0]} :: ${_req.authCode}`)
    else
        log.add_Color('333333', `[RECV] ${_req.params[0]} :: ${_req.authCode}`, _req.query)

    CheckingUserConnect(_req.AuthCode, '', true)

    _next()
})
//#endregion

router.get('/connect', (_req, _res) => {

    // Load UserData
    mariaDB.GetUserAuth_AuthCode(_req.authCode, _userInfo => {

        // 유저가 없어?? 새로 만들어주자
        if (_userInfo == null) {
            mariaDB.CreateNewUser(_userInfo => {
                ReqUserInfo(_req, _userInfo)
            })
        }
        else {
            ReqUserInfo(_req, _userInfo)
        }
    })
})

router.get('/disconnect', (_req, _res) => {
    // 나갔다면
    const index = clients.indexOf(_req.authCode)
    if (index > -1) {
        clients.splice(index, 1)
        log.add(`Disconnect :: [${clients.length}] ${_req.authCode} (${_req.query['Nickname']})`)
    }
    _res.send('thx!!')
})

function ReqUserInfo(_req, _userInfo) {
    log.add("connect/", _userInfo)

    let packet = new req_packet()
    packet.AuthCode = _userInfo.AuthCode
    packet.Nickname = _userInfo.Nickname
    packet.Coin = _userInfo.Coin
    
    _res.send(JSON.stringify(packet))

    CheckingUserConnect(_req.AuthCode, _userInfo.Nickname)
}

function CheckingUserConnect(_authCode, _nickname, _isReconnect) {
    if (clients.length == 0 || clients.indexOf(_authCode) == -1) {
        clients.push(_authCode)
        log.add(`${_isReconnect ? 'Reconnect' : 'Connect'} :: [${clients.length}] ${_authCode} ${_isReconnect == true ? '' : `(${_nickname})`}`)

        mariaDB.SetLogin(_userData.AuthCode);
    }
}