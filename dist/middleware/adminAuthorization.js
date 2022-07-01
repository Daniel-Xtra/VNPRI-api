"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuthorize = void 0;
const passport_1 = __importDefault(require("passport"));
const User_1 = require("./../api/User");
const app_error_1 = require("./../utils/app-error");
/**
 * middleware for checking admin authorization with jwt
 */
const adminAuthorize = (req, res, next) => {
    passport_1.default.authenticate("jwt", { session: false }, async (error, token) => {
        if (error || !token) {
            return next(new app_error_1.AppError("Unauthorized", null, 401));
        }
        try {
            const userDetails = await User_1.UserModel.findByPk(token.id, { raw: true });
            if (userDetails.membership_type !== "admin") {
                return next(new app_error_1.AppError("You are not a valid Admin", null, 400));
            }
            const admin = await User_1.UserModel.findOne({
                where: { username: token.username },
            });
            if (!admin) {
                return next(new app_error_1.AppError("Unauthorized", null, 401));
            }
            if (admin.membership_type !== "admin") {
                return next(new app_error_1.AppError("You are not a valid Admin", null, 400));
            }
            req.user = admin;
        }
        catch (error) {
            return next(error);
        }
        next();
    })(req, res, next);
};
exports.adminAuthorize = adminAuthorize;
//# sourceMappingURL=adminAuthorization.js.map