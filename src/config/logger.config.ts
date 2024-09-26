import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize, errors } = format;

// Custom format for logs
const customFormat = printf(({ level, message, timestamp, stack }) => {
	return `${timestamp} ${level}: ${stack || message}`;
});

// Create a logger instance
const logger = createLogger({
	level: 'info', // Default log level. You can adjust it as needed (e.g., 'debug', 'warn', 'error')
	format: combine(
		colorize(),  // Colorize log output (useful in development)
		timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		errors({ stack: true }), // Log the stack trace for errors
		customFormat // Apply custom format
	),
	transports: [
		new transports.Console(), // Log to the console
		new transports.File({ filename: 'logs/error.log', level: 'error' }), // Log errors to a file
		new transports.File({ filename: 'logs/combined.log' }) // Log all levels to a file
	]
});

// Export the logger
export default logger;