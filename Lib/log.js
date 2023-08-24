const color = require('chalk')

class LogController {

    add = (_log, ..._option) => {
        if (_option.length == 0)
            console.log(this.GetTimeLog() + _log)
        else
            console.log(this.GetTimeLog() + _log, _option)
    }

    addWarning = (_log, ..._option) => {
        var log = color.hex(`#888800`)(this.GetTimeLog() + _log)
        if (_option.length == 0)
            console.log(log)
        else
            console.log(log, _option)
    }
    
    addError = (_log, ..._option) => {
        var log = color.hex(`#880000`)(this.GetTimeLog() + _log)
        if (_option.length == 0)
            console.log(log)
        else
            console.log(log, _option)
    }

    add_Color = (_color, _log, ..._option) => {
        var log = color.hex(`#${_color}`)(this.GetTimeLog() + _log)
        if (_option.length == 0)
            console.log(log)
        else
            console.log(log, _option)
    }

    addRecv = (_log, ..._option) => {
        var log = color.hex(`#00ff00`)(this.GetTimeLog() + _log)
        if (_option.length == 0)
            console.log(log)
        else
            console.log(log, _option)
    }

    addReq = (_log, ..._option) => {
        var log = color.hex(`#0088ff`)(this.GetTimeLog() + _log)
        if (_option.length == 0)
            console.log(log)
        else
            console.log(log, _option)
    }

    GetTimeLog = () => {
        const time = new Date()
        return `[${time.getUTCMonth().toString().padStart(2, '0')}-${time.getUTCDate().toString().padStart(2, '0')} ${time.getUTCHours().toString().padStart(2, '0')}:${time.getUTCMinutes().toString().padStart(2, '0')}:${time.getUTCSeconds().toString().padStart(2, '0')}:${time.getUTCMilliseconds().toString().padStart(3, '0')}] `
    }
}

module.exports = new LogController()