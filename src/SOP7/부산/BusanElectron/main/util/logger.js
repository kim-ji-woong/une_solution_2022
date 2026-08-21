const log = require('electron-log')
const path = require('path')
const { app } = require('electron')

const startTime = new Date()
const timeString = toStringByFormatting(startTime, "_")
const resolvePath = GetResolvePath();

function GetResolvePath() {
    const appPath = app.getAppPath()

    if (appPath.indexOf("asar") >= 0) {
        return path.join(path.dirname(path.dirname(app.getAppPath())), `logs/electron_${timeString}.log`);
    }
    else {
        return path.join((path.dirname(app.getAppPath())), `logs/electron_${timeString}.log`);
    }
}

function leftPad(value) {
    if (value >= 10) {
        return value;
    }

    return `0${value}`;
}

function toStringByFormatting(source, delimiter = "-") {
    const year = source.getFullYear()
    const month = leftPad(source.getMonth() + 1)
    const day = leftPad(source.getDate())

    const hour = leftPad(source.getHours())
    const minute = leftPad(source.getMinutes())
    const second = leftPad(source.getSeconds())

    return [`${year}${month}${day}`, `${hour}${minute}${second}`].join(delimiter)
}

log.transports.file.resolvePath = () => {
    return resolvePath
}

log.info("[SELF] " + log.transports.file.resolvePath())

module.exports = {
    info: function (msg) {
        log.info(msg)
    }
}