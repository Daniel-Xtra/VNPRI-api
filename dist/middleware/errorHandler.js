"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
exports.default = (err, req, res, next) => {
    if (!err.isOperational) {
        if (config_1.ENVIRONMENT !== "development") {
            logger_1.logger.error("An unexpected error occurred please restart the application!", "\nError: " + err.message + " Stack: " + err.stack);
            process.exit(1);
        }
    }
    logger_1.logger.error(`${err.statusCode || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip} - Stack: ${err.stack}`);
    err.stack = err.stack || "";
    const errorDetails = {
        status: false,
        message: err.message,
        statusCode: err.statusCode || 500,
        data: err.data,
        stack: err.stack,
    };
    if (config_1.ENVIRONMENT === "production") {
        delete errorDetails.stack;
    }
    res.status(err.statusCode || 500);
    return res.json(errorDetails);
};
//# sourceMappingURL=errorHandler.js.map