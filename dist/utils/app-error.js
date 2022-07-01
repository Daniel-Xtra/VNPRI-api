"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    constructor(message, data = null, statusCode = 400, isOperational = true) {
        super(message);
        Error.captureStackTrace(this, AppError);
        this.message = message;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.data = data;
    }
}
exports.AppError = AppError;
//# sourceMappingURL=app-error.js.map