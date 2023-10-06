const mariaDB = require('../Manager/MariaManager')
const log = require('../../Lib/log')
const { NextFunction, Request, Response, Router } = require('express');
const req_packet = require('../../Lib/packet')
//const enums = require('../enums');

const clients = []
const router = Router()
module.exports = router

router.post('/connect', (_req, _res) => {

    // Load UserData
    mariaDB.GetUserAuth_AuthID(_req.body.authID, _userInfo => {

        // 유저가 없어?? 새로 만들어주자
        if (_userInfo == null) {
            mariaDB.CreateNewUser(_req.body.authID, _userInfo => {
                ReqUserInfo(_res, _userInfo)
            })
        }
        else {
            ReqUserInfo(_res, _userInfo)
        }
    })
})

router.post('/disconnect', (_req, _res) => {
    const authCode = _req.headers['authorization']
    // 나갔다면
    const index = clients.findIndex(_x => _x.authCode = authCode)
    if (index > -1) {
        log.add(`Disconnect :: [${clients.length - 1}] ${clients[index].nickname}`)
        clients.splice(index, 1)
    }

    var packet = new req_packet();
    packet.message = "thx!!"
    _res.send(packet.ToJson())
})

router.all('/*', (_req, _res, _next) => {
    const authCode = _req.headers['authorization']
    if (authCode == undefined)
        return;
    _req.authCode = authCode

    if (Object.keys(_req.query).length == 0)
        log.add_Color('333333', `[RECV] ${_req.params[0]} :: ${_req.authCode}`)
    else
        log.add_Color('333333', `[RECV] ${_req.params[0]} :: ${_req.authCode}`, _req.query)

    _next()
})

router.use('/plus', require('./Router/Game_Plus'))

function ReqUserInfo(_res, _userInfo) {
    let packet = new req_packet()
    packet.authCode = _userInfo.AuthCode
    packet.nickname = _userInfo.Nickname
    packet.coin = _userInfo.Coin

    _res.send(packet.ToJson())

    CheckingUserConnect(_userInfo.AuthCode, _userInfo.Nickname)
}

function CheckingUserConnect(_authCode, _nickname) {
    if (clients.length == 0 || clients.indexOf(_authCode) == -1) {
        clients.push({ authCode: _authCode, nickname: _nickname })
        log.add(`Connect :: [${clients.length}] ${_nickname}`)

        mariaDB.SetLogin(_authCode);
    }
}