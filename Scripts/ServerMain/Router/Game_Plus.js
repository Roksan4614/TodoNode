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

router.get('/ResultGame', (_req, _res) => {

    mariaDB.ResultGame_Plus(_req.authCode, _req.query.point, _req.query.correctRate, _req.query.dps, _req.query.combo, _req.query.coin, _result => {
        let packet = new req_packet()

        // 여기서 null 은 new record 가 아니라는 의미
        if (_result != null) {
            packet.isNewRecord = 1

            // 데이타 갖고 있기
            {
                let recordData = {
                    AuthCode: _req.authCode,
                    Point: _req.query.point,
                    CorrectRate: _req.query.correctRate,
                    Dps: _req.query.dps,
                    Combo: _req.query.combo
                }

                let rankerIndex = rankingData.find(_ranker => { return _ranker.AuthCode == _req.authCode })
                if (ranker == -1) {
                    rankingData.push(
                        recordData
                    )
                }
                else
                    rankingData[rankerIndex] = recordData
            }
        }

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