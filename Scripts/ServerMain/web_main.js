//#region Initialize
const mariaDB = require('../MariaManager')
const log = require('../../Lib/log')
const { express } = require('../../Lib/http')
const { NextFunction, Request, Response, Router } = require('express');
const enums = require('../enums');

const clients = []
class CLobbyManager {
    router;

    constructor() {
        this.router = Router()
    }
}

const web = new CLobbyManager();
module.exports = web

express.use('/player', require('./Router/player'))

web.router.all('/*', (_req, _res, _next) => {
    const authCode = _req.headers['authorization']
    if (authCode != undefined)
        _req.authCode = authCode

    if (Object.keys(_req.query).length == 0)
        log.add_Color('333333', `[RECV] ${_req.params[0]} :: ${_req.authCode}`)
    else
        log.add_Color('333333', `[RECV] ${_req.params[0]} :: ${_req.authCode}`, _req.query)
    _next()
})
//#endregion

web.router.get('/connect', (_req, _res) => {

    // Load UserData
    mariaDB.GetUserAuth_AuthCode(_req.authCode, _authData => {

        mariaDB.GetUserData(_authData.AuthCode, _userData => {
            // 새로 들어왔다면
            if (clients.length == 0 || clients.indexOf(_req.authCode) == -1) {
                clients.push(_req.authCode)
                log.add(`Connect :: [${clients.length}] ${_req.authCode} (${_userData.Nickname})`)

                mariaDB.SetLogin(_userData.AuthCode);
            }

            _res.send(JSON.stringify(_userData))
        })
    })
})

web.router.get('/disconnect', (_req, _res) => {
    // 나갔다면
    const index = clients.indexOf(_req.authCode)
    if (index > -1) {
        clients.splice(index, 1)
        log.add(`Disconnect :: [${clients.length}] ${_req.authCode} (${_req.query['Nickname']})`)
    }
    _res.send('thx!!')
})

web.router.get('/createUser', (_req, _res)=>{
    mariaDB.CreateNewUser("test new token", _result =>{
        _res.send(JSON.stringify(_result))
    })
})