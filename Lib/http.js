const log = require('./log')
const req_express = require('express')
const req_cors = require('cors')

// Create express
const express = req_express()

express.use(req_express.json())
express.use(req_express.urlencoded({ extended: false }))
express.use(req_cors())

express.get('/ping', (_req, _res)=>{_res.send('pong')})


// Create http server
const req_http = require('http')
const http = req_http.createServer(express)

http.on('error', onError)

function onError(error) {
    log.add_Color('ff0000', `WebSever error :: `, error)
}

module.exports = {
    express, http
}