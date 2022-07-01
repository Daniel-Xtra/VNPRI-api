"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationHandler = void 0;
const validationHandler = (err, data) => {
    if (err) {
        const message = err.details[0].message.replace(/['"]/g, "");
        // Joi Error
        const JoiError = {
            status: false,
            message,
        };
        // Send back the JSON error response
        return { status: false, data: JoiError };
    }
    else {
        // Return with the data after Joi validation
        return { status: true, data };
    }
};
exports.validationHandler = validationHandler;
//# sourceMappingURL=validationHandler.js.map