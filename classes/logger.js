import * as winston from "winston";

const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 4,
};

const today = new Date();

/**
 * 
 * @param {*} tag 
 * @returns 
 */
const logger = tag =>
    winston.createLogger({
        levels: logLevels,
        transports: [
            new winston.transports.Console({
                level: "debug",
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.padLevels({ levels: logLevels }),
                    winston.format.timestamp(),
                    winston.format.printf(info => `${info.timestamp} ${info.level}: ${tag}${info.message}`),
                ),
            }),
            new winston.transports.File({
                level: "warn",
                zippedArchive: true,
                filename: `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}.log`,
                dirname: "logs",
                format: winston.format.combine(
                    winston.format.padLevels({ levels: logLevels }),
                    winston.format.timestamp(),
                    winston.format.printf(info => `${info.timestamp} ${info.level}: ${tag}${info.message}`),
                )
            })
        ],
        levelport: 'debug',
    });

winston.addColors({
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
});

export default logger;