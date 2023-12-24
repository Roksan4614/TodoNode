const mariaDB = require('../Manager/MariaManager')
const log = require('../../Lib/log')
const { NextFunction, Request, Response, Router } = require('express');
const req_packet = require('../../Lib/packet')
//const enums = require('../enums');

const clients = []
const router = Router()
module.exports = router
const api_key = 'roksan1126091011040330'

// router.all('/*', (_req, _res, _next) => {
// })

router.post('/Connect', (_req, _res) => {
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

router.post('/Disconnect', (_req, _res) => {
    const authCode = _req.headers['authcode']

    // 나갔다면
    const index = clients.findIndex(_x => _x.authCode = authCode)

    if (index > -1) {
        log.add_Color(`222222`, `Disconnect:: [${clients.length - 1}] ${clients[index].nickname}`)
        clients.splice(index, 1)
    }

    var packet = new req_packet();
    packet.message = "thx!!"

    packet.Send(_req.originalUrl, _req.authCode, _res, false);
})

router.post('/user_count', (_req, _res) => {
    var packet = new req_packet()
    packet.user_count = _req.body.password === "50252335" ? clients.length : -1

    packet.Send(_req.originalUrl, _req.authCode, _res);
})

router.all('/*', (_req, _res, _next) => {

    if (api_key != _req.headers['apiKey'])
    {
        log.add("API_KEY ERROR: ", _req.headers['apiKey'])
    }

    const authCode = _req.headers['authcode']
    if (authCode == undefined){
        log.add("authCode is undefined");
        return;
    }
    _req.authCode = authCode

    log.add_Color('333333', `[RECV] ${_req.originalUrl}:`, _req.authCode, JSON.stringify(_req.body))

    // if (Object.keys(_req.query).length == 0)
    //     log.add_Color('333333', `[RECV] ${_req.params[0]} :: ${_req.authCode}`)
    // else
    //     log.add_Color('333333', `[RECV] ${_req.params[0]} :: ${_req.authCode}`, _req.query)

    _next()
})

router.post('/nickname_change', (_req,_res) =>{
    mariaDB.SetNickname(_req.authCode, _req.body.nickname, _result => {
        var packet = new req_packet()
        if( _result == null)
            packet.resultCode = "system error"
        else{
            index = clients.findIndex(_x => _x.authCode = _req.authCode)
            if (index > -1)
                clients[index].nickname = _req.body.nickname
        }

        packet.Send(_req.originalUrl, _req.authCode, _res);
    })
})

router.use('/plus', require('./Router/Game_Plus'))

function ReqUserInfo(_res, _userInfo) {
    let packet = new req_packet()
    packet.authCode = _userInfo.AuthCode
    packet.nickname = _userInfo.Nickname
    packet.coin = _userInfo.Coin

    packet.Send('/Connect', packet.authCode, _res, false);

    CheckingUserConnect(_userInfo.AuthCode, _userInfo.Nickname)
}

function CheckingUserConnect(_authCode, _nickname) {
    if (clients.length == 0 || clients.some(x => x.authCode == _authCode) == false) {
        clients.push({ authCode: _authCode, nickname: _nickname })
        log.add(`   Connect:: [${clients.length}] ${_nickname} (${_authCode})`)

        mariaDB.SetLogin(_authCode);
    }
}