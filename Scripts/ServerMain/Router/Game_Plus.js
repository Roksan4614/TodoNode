const mariaDB = require('../../Manager/MariaManager')
const { NextFunction, Request, Response, Router } = require('express');
const req_packet = require('../../../Lib/packet')
const log = require('../../../Lib/log')
const enums = require('../../enums');

router = Router()
module.exports = router

m_rankingData = []

router.post('/Fetch/Ranking', (_req, _res) => {
    let packet = new req_packet()

    if (m_rankingData.length < 10)
        packet.rc = enums.resultCode.NotEnoughData.index
    else {
        let ranking = m_rankingData.findIndex(_ranker => { return _ranker.AuthCode == _req.authCode })
        packet.champion = m_rankingData[0]
        packet.userCount = m_rankingData.length
        packet.ranking = ranking
    }

    _res.send(packet.ToJson())
})

router.post('/ResultGame', (_req, _res) => {

    mariaDB.ResultGame_Plus(_req.authCode, _req.body.point, _req.body.correctRate, _req.body.dps, _req.body.combo, _req.body.coin, _result => {
        let packet = new req_packet()

        // 여기서 null 은 new record 가 아니라는 의미
        if (_result != null) {
            packet.isNewRecord = 1

            // 데이타 갖고 있기
            {
                let recordData = {
                    AuthCode: _req.authCode,
                    Point: _req.body.point,
                    CorrectRate: _req.body.correctRate,
                    Dps: _req.body.dps,
                    Combo: _req.body.combo
                }

                let rankerIndex = m_rankingData.find(_ranker => { return _ranker.AuthCode == _req.authCode })
                if (ranker == -1) {
                    m_rankingData.push(
                        recordData
                    )
                }
                else
                    m_rankingData[rankerIndex] = recordData
            }
        }

        _res.send(packet.ToJson())
    });
})

mariaDB.GetRankingData_Plus(_rankingData => {
    i = 0
    for (; i < _rankingData.length; i++) {
        m_rankingData.push(_rankingData[i])
    }

    for (; i < 10; i++) {
        m_rankingData.push(
            {
                Point: Math.floor(Math.random() * (4000 - 1000 + 1)) + 1000,
                CorrectRate: 100,
                Dps: 0.113,
                Combo: Math.floor(Math.random() * (40 - 20 + 1)) + 20
            }
        )
    }

    m_rankingData.sort(function (a, b) {
        return b.Point - a.Point
    })
})