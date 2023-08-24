const { NextFunction, Request, Response, Router } = require('express');
const router = Router()
const log = require('../../../Lib/log')

router.get('/userData', (_req, _res) => {

    log.addRecv('playerRouter :: ', req)

    _res.send('유저데이타 보내줄게')

})

module.exports = router;