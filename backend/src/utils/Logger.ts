const fs = require("fs");
const path = require("path");

class Logger {
	private readonly logsDir: string;

	constructor(logsDir = "src/logs") {
		this.logsDir = logsDir;
		this.ensureLogsDir();
	}

	ensureLogsDir() {
		if (!fs.existsSync(this.logsDir)) {
			fs.mkdirSync(this.logsDir, { recursive: true });
		}
	}

	getLogFileName() {
		const today = new Date().toISOString().split("T")[0];
		return path.join(this.logsDir, `${today}.log`);
	}

	formatLog(level, message, data = {}) {
		const timestamp = new Date().toISOString();
		return `[${timestamp}] [${level}] ${message} ${JSON.stringify(data)}\n`;
	}

	info(message, data = {}) {
		const logMessage = this.formatLog("INFO", message, data);
		console.log(logMessage);
		this.writeToFile(logMessage);
	}

	error(message, data = {}) {
		const logMessage = this.formatLog("ERROR", message, data);
		console.error(logMessage);
		this.writeToFile(logMessage);
	}

	warn(message, data = {}) {
		const logMessage = this.formatLog("WARN", message, data);
		console.warn(logMessage);
		this.writeToFile(logMessage);
	}

	debug(message, data = {}) {
		const logMessage = this.formatLog("DEBUG", message, data);
		if (process.env.NODE_ENV === "development") {
			console.log(logMessage);
		}
		this.writeToFile(logMessage);
	}

	writeToFile(message) {
		const fileName = this.getLogFileName();
		fs.appendFileSync(fileName, message);
	}
}

module.exports = new Logger();
