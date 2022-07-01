"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const passport_1 = __importDefault(require("passport"));
const User_1 = require("./../api/User");
const app_error_1 = require("./../utils/app-error");
/**
 * middleware for checking user authorization with jwt
 */
const authorize = (req, res, next) => {
    passport_1.default.authenticate("jwt", { session: false }, async (error, token) => {
        if (error || !token) {
            return next(new app_error_1.AppError("Unauthorized", null, 401));
        }
        try {
            const user = await User_1.UserModel.findOne({
                where: { username: token.username },
            });
            if (!user) {
                return next(new app_error_1.AppError("Unauthorized", null, 401));
            }
            req.user = user;
        }
        catch (error) {
            return next(error);
        }
        next();
    })(req, res, next);
};
exports.authorize = authorize;
//# sourceMappingURL=authorization.js.map