"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.NotificationValidationSchema = joi_1.default.object().keys({
    message: joi_1.default.string().trim().required(),
    context: joi_1.default.string().trim().required(),
    triggered_by: joi_1.default.number(),
});
//# sourceMappingURL=notificationValidation.js.map