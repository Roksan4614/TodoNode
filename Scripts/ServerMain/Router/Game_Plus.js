const mariaDB = require('../../Manager/MariaManager')
const { NextFunction, Request, Response, Router } = require('express');
const req_packet = require('../../../Lib/packet')
const log = require('../../../Lib/log')
const enums = require('../../enums');

router = Router()
module.exports = router

rankingData = []

router.get('/FetchRanking', (_req, _res) => {
    let ranking = rankingData.findIndex(_ranker => { return _ranker.AuthCode == _req.authCode })
    let packet = new req_packet()
    if (ranking == -1)
        packet.rc = enums.resultCode.UserNotFind
    else {
        packet.champion = rankingData[0]
        packet.userCount = rankingData.length
        packet.ranking = ranking
    }
    _res.send(JSON.stringify(packet))
})

router.get('/AddRanking', (_req, _res) => {

    mariaDB.AddRanking_Plus(_req.authCode, _req.query.point, _req.query.correctRate, _req.query.dps, _req.query.combo, _result => {
        let packet = new req_packet()

        if (_result == null)
            packet.rc = enums.resultCode.Failed

        _res.send(JSON.stringify(packet))
    });
})

mariaDB.GetRankingData_Plus(_rankingData => {
    for (var i = 0; i < _rankingData.length; i++) {
        rankingData.push(_rankingData[i])
    }
    rankingData.sort(function (a, b) {
        return b.Point - a.Point
    })
})