const mariaDB = require('./Scripts/MariaManager')
const log = require('./Lib/log')
const config = require('./Scripts/config');
const web = require('./Scripts/ServerMain/web_main')
const { express, http } = require('./Lib/http')
const req_packet = require('./Lib/packet')
const enums = require('./Scripts/enums')

// 웹서버 올리기
http.listen(config.PORT_WEB, () => log.add_Color('ffff00', `WebServer start :: ${config.PORT_WEB}`))
express.use('/roksan', web.router)

// 인증코드 주기
express.get('/access', (_req, _res) => {
    authCode = _req.query['AuthCode']
    mariaDB.GetUserAuth_AuthCode(authCode, _userInfo => {
        resultCode = _userInfo == undefined ? enums.resultCode.UserNotFind : enums.resultCode.Success
        packet = new req_packet(0, resultCode)

        if (enums.resultCode != enums.resultCode.Success) {
            packet.AuthCode = _userInfo.AuthCode
        }

        _res.send(JSON.stringify(packet))
    })
})

// 종료 될 때 db 연결 해제해 주자
process.on('SIGINT', () => {
    http.close(() => {
        console.log("server off")
    })
});