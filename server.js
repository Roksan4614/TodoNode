const mariaDB = require('./Scripts/Manager/MariaManager')
const log = require('./Lib/log')
const config = require('./Scripts/config');
const { express, http } = require('./Lib/http')
const enums = require('./Scripts/enums')

// 웹서버 올리기
http.listen(config.PORT_WEB, () => log.add_Color('ffff00', `12240139: WebServer start :: ${config.PORT_WEB}`))

express.use('/roksan', require('./Scripts/ServerMain/web_main'))

process.on('SIGINT', () => {
    http.close(() => {
        console.log("server off")
    })
});