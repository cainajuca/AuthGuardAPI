import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, printf, colorize, errors } = format;

const customFormat = printf(({ level, message, timestamp, stack }) => {
	return `${timestamp} ${level}: ${stack || message}`;
});

const errorFileTransport = new DailyRotateFile({
    level: 'error',
	filename: 'logs/error-%DATE%.log',
	datePattern: 'YYYY-MM-DD',
	maxFiles: '14d',
	zippedArchive: true,
});

const combinedFileTransport = new DailyRotateFile({
    filename: 'logs/combined-%DATE%.log',
	datePattern: 'YYYY-MM-DD',
	maxFiles: '30d',
	zippedArchive: true,
});

const logger = createLogger({
	level: 'info',
	format: combine(
		colorize(),
		timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		errors({ stack: true }),
		customFormat
	),
	transports: [
		errorFileTransport,
		combinedFileTransport,
		new transports.Console(),
	]
});

export default logger;