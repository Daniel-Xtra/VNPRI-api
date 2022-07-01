"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const app_root_path_1 = __importDefault(require("app-root-path"));
const winston_1 = require("winston");
const config_1 = require("../config");
const { combine, timestamp, printf } = winston_1.format;
const logFormat = printf((info) => {
    return `${info.timestamp} [${info.level}]: ${info.message}`;
});
const options = {
    error: {
        level: "error",
        filename: `${app_root_path_1.default}/logs/error.log`,
        handleExceptions: true,
        format: combine(timestamp(), logFormat),
        maxsize: 5242880,
        maxFiles: 5,
        colorize: false,
    },
    combined: {
        level: "info",
        filename: `${app_root_path_1.default}/logs/app.log`,
        handleExceptions: true,
        format: combine(timestamp(), logFormat),
        maxsize: 5242880,
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: "debug",
        levels: winston_1.config.npm.levels,
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};
// instantiate a new Winston Logger with the settings defined above
exports.logger = winston_1.createLogger({
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
    transports: [
        new winston_1.transports.File(options.error),
        new winston_1.transports.File(options.combined),
    ],
    exitOnError: false, // do not exit on handled exceptions
});
// If we're not in production then log to the `console` with the format:
if (config_1.ENVIRONMENT !== "production") {
    exports.logger.add(new winston_1.transports.Console({
        format: combine(winston_1.format.colorize(), logFormat),
    }));
}
//# sourceMappingURL=logger.js.map