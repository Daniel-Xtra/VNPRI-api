"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.ProfileValidationSchema = joi_1.default.object().keys({
    religion: joi_1.default.any(),
    sexual_orientation: joi_1.default.any(),
    relationship_status: joi_1.default.any(),
    occupation: joi_1.default.any(),
    ethnic_group: joi_1.default.any(),
    location: joi_1.default.any(),
    highest_education: joi_1.default.any(),
    current_education: joi_1.default.any(),
    bio: joi_1.default.any(),
    facebook_url: joi_1.default.any(),
    twitter_url: joi_1.default.any(),
    instagram_url: joi_1.default.any(),
    snapchat_id: joi_1.default.any(),
});
//# sourceMappingURL=profileValidation.js.map