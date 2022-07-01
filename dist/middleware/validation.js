"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = void 0;
const joi_1 = __importDefault(require("joi"));
const lodash_1 = __importDefault(require("lodash"));
const validationHandler_1 = require("./../shared/validationHandler");
/**
 *  Validates incoming input in the body of a request.
 *  Runs only on POST or PUT requests
 *
 * @export
 * @param {*} schema validationSchema for this route
 * @returns
 */
const validation = (schema, options) => {
    // enabled HTTP methods for request data validation
    const _supportedMethods = ["post", "put", "patch"];
    // Joi validation options
    const _validationOptions = {
        abortEarly: true,
        allowUnknown: true,
        stripUnknown: true,
        ...options,
    };
    // return the validation middleware
    return (req, res, next) => {
        const method = req.method.toLowerCase();
        if (lodash_1.default.includes(_supportedMethods, method) && schema) {
            // Validate req.body using the schema and validation options
            const validationRes = joi_1.default.validate(req.body, schema, _validationOptions, validationHandler_1.validationHandler);
            if (!validationRes.status) {
                res.status(400).json(validationRes.data);
            }
            else {
                // Replace req.body with the data after Joi validation
                req.body = validationRes.data;
                next();
            }
        }
        else {
            next();
        }
    };
};
exports.validation = validation;
//# sourceMappingURL=validation.js.map