const mariaDB = require('../../Manager/MariaManager')
const { NextFunction, Request, Response, Router } = require('express');
const req_packet = require('../../../Lib/packet')
const log = require('../../../Lib/log')

router = Router()
module.exports = router

m_rankingData = []

router.post('/Fetch/Ranking', (_req, _res) => {
    let packet = new req_packet()

    if (m_rankingData.length > 0) {
        packet.champion = {
            recordPoint: m_rankingData[0].Point,
            mostCombo: m_rankingData[0].Combo,
            mostCorrectRate: m_rankingData[0].CorrectRate,
            mostDps: m_rankingData[0].Dps,
        }
    }

    if (m_rankingData.length >= 10) {
        packet.userCount = m_rankingData.length
        packet.ranking = m_rankingData.findIndex(_ranker => { return _ranker.AuthCode == _req.authCode })
    }

    packet.Send(_req.originalUrl, _req.authCode, _res);
})

router.post('/ResultGame', (_req, _res) => {

    mariaDB.ResultGame_Plus(_req.authCode, _req.body.point, _req.body.correctRate, _req.body.dps, _req.body.combo, _req.body.coin, _result => {
        let packet = new req_packet()

        if (_result != null) {
            // 데이타 갖고 있기
            let recordData = {
                AuthCode: _req.authCode,
                Point: _req.body.point,
                CorrectRate: _req.body.correctRate,
                Dps: _req.body.dps,
                Combo: _req.body.combo
            }

            let rankerIndex = m_rankingData.findIndex(_ranker => { return _ranker.authCode == _req.authCode })
            if (rankerIndex == -1) {
                m_rankingData.push(
                    recordData
                )
            }
            else
                m_rankingData[rankerIndex] = recordData

            m_rankingData.sort(function (a, b) {
                return b.Point - a.Point
            })
        }

        packet.champion = {
            recordPoint: m_rankingData[0].Point,
            mostCombo: m_rankingData[0].Combo,
            mostCorrectRate: m_rankingData[0].CorrectRate,
            mostDps: m_rankingData[0].Dps,
        }

        if (m_rankingData.length >= 10) {
            packet.userCount = m_rankingData.length
            packet.ranking = m_rankingData.findIndex(_ranker => { return _ranker.AuthCode == _req.authCode })
        }
        
        packet.Send(_req.originalUrl, _req.authCode, _res);
    });
})

mariaDB.GetRankingData_Plus(_rankingData => {
    if (_rankingData != undefined) {

        if (_rankingData.Point == undefined) {
            for (i = 0; i < _rankingData.length; i++) {
                m_rankingData.push(_rankingData[i])
            }
        }
        else
            m_rankingData.push(_rankingData)
    }

    m_rankingData.sort(function (a, b) {
        return b.Point - a.Point
    })

    log.add("RankingData: ", `UserCount: ${m_rankingData.length}`)
})