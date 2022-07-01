"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.UserValidationSchema = joi_1.default.object().keys({
    username: joi_1.default.string().regex(/^[a-zA-Z0-9._-]{3,16}$/i),
    password: joi_1.default.string().min(6).max(32),
    email: joi_1.default.string().email({ minDomainAtoms: 2 }),
    phone_number: joi_1.default.string().regex(/^[0-9+]{3,16}$/),
    first_name: joi_1.default.string().max(30).allow("").optional(),
    last_name: joi_1.default.string().max(30).allow("").optional(),
    gender: joi_1.default.string(),
    membership_type: joi_1.default.string(),
    email_verification_code: joi_1.default.string(),
});
//# sourceMappingURL=userValidation.js.map