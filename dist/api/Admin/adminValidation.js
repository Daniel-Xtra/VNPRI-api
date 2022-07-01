"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.PostValidationSchema = joi_1.default.object().keys({
    title: joi_1.default.string().regex(/[a-zA-Z0-9!?._\s]$/i).trim().max(80).required().error((err) => {
        return "Emojis are not allowed in the title field.";
    }),
    content: joi_1.default.string().required(),
    slug: joi_1.default.string(),
});
//# sourceMappingURL=adminValidation.js.map