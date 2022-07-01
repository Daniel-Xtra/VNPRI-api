"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokensValidationSchema = exports.adminSignupValidationSchema = exports.SignupValidationSchema = exports.LoginValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.LoginValidationSchema = joi_1.default.object().keys({
    username: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
    code: joi_1.default.string(),
});
exports.SignupValidationSchema = joi_1.default.object().keys({
    username: joi_1.default.string()
        .regex(/^[a-zA-Z0-9._-]{3,16}$/i)
        .required(),
    first_name: joi_1.default.string().max(30).required(),
    last_name: joi_1.default.string().max(30).required(),
    email: joi_1.default.string().email().required(),
    phone_number: joi_1.default.number().required(),
    gender: joi_1.default.string().required(),
    membership_type: joi_1.default.string(),
    code: joi_1.default.string(),
});
exports.adminSignupValidationSchema = joi_1.default.object().keys({
    username: joi_1.default.string()
        .regex(/^[a-zA-Z0-9._-]{3,16}$/i)
        .required(),
    password: joi_1.default.string().min(6).max(32).required(),
    first_name: joi_1.default.string().max(30).required(),
    last_name: joi_1.default.string().max(30).required(),
    email: joi_1.default.string().email().required(),
    phone_number: joi_1.default.number().required(),
    gender: joi_1.default.string().required(),
    membership_type: joi_1.default.string(),
    code: joi_1.default.string(),
});
exports.RefreshTokensValidationSchema = joi_1.default.object().keys({
    refreshToken: joi_1.default.string().required(),
});
//# sourceMappingURL=authValidation.js.map