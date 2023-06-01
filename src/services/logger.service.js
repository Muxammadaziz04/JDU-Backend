const log4js = require("log4js");
const moment = require('moment');

log4js.configure({
    appenders: {
        console: { type: 'console' },
        file: {
            type: 'file',
            filename: `logs/app-${moment().format('YYYY-MM-DD')}.log`,
            pattern: '-yyyy-MM-dd',
            keepFileExt: true,
            utc: false,
            maxLogSize: 10485760,
            backups: 3,
            compress: true,
        }
    },
    categories: {
        default: { appenders: ['console', 'file'], level: 'info' }
    }
});

const logger = log4js.getLogger()

module.exports = logger