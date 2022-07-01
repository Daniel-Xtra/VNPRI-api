"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./../../config");
const User_1 = require("./../User");
const app_error_1 = require("./../../utils/app-error");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class AuthService {
    /**
     * Jwt token verifiation and find user details
     *
     * @param {string} token refresh token of user
     * @returns user details
     * @memberof AuthController
     */
    async verifyJwtToken(token) {
        try {
            // verify the jwt token
            const decoded = await jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET_REFRESHTOKEN);
            // check the token is verified or not
            if (decoded) {
                // find userDetails from user model by decoded user_id
                const userDetails = await User_1.UserModel.findByPk(decoded.user.id, {
                    raw: true,
                });
                return userDetails;
            }
        }
        catch (e) {
            throw new app_error_1.AppError("Invalid refresh token sent", "refreshToken", 404);
        }
    }
    /**
     * Jwt token validation and find user details
     *
     * @param {string} username
     * @returns user details
     * @memberof AuthController
     */
    async validateUsername(username) {
        try {
            // TODO: check for username , phone number and email address
            const checkUsername = await User_1.UserModel.findOne({
                where: {
                    username,
                },
                attributes: ["username"],
                raw: true,
            });
            return checkUsername;
        }
        catch (e) {
            throw new app_error_1.AppError("error fetching username");
        }
    }
    async validateEmail(email) {
        try {
            // TODO: check for email address
            const checkEmail = await User_1.UserModel.findOne({
                where: {
                    email,
                },
                raw: true,
            });
            return checkEmail;
        }
        catch (e) {
            throw new app_error_1.AppError("error fetching email");
        }
    }
    async validatePhone(phone_number) {
        try {
            // TODO: check for phone number
            const checkPhone = await User_1.UserModel.findOne({
                where: {
                    phone_number,
                },
                raw: true,
            });
            return checkPhone;
        }
        catch (e) {
            throw new app_error_1.AppError("error fetching phone");
        }
    }
    /**
     * This function is used for logout
     *
     * @param {string} userId of the current user
     * @returns updated
     * @memberof AuthController
     */
    async logout(userId) {
        // update the player_id of the user model by the userId
        const updated = await User_1.UserModel.update({ player_id: null }, { where: { id: userId } });
        if (updated) {
            return updated;
        }
    }
    /**
     * This function is used for find user details by id
     *
     * @param {string} id of the current user
     * @returns userDetails
     * @memberof AuthController
     */
    async findUserDetailsById(id) {
        // find user details from user model by id
        const user = await User_1.UserModel.findOne({
            where: { id },
        });
        if (user) {
            return user;
        }
    }
    /**
     * generates JWT access token from user details
     *
     * @public
     * @param {IUser} user authenticated user
     * @returns {string} signed JWT
     * @memberof AuthController
     */
    async generateToken(user) {
        const body = { id: user.id, username: user.username };
        // generate jwt access token using jwt_secret
        const token = jsonwebtoken_1.default.sign({ user: body }, config_1.JWT_SECRET, { expiresIn: "180d" });
        return token;
    }
    /**
     * generates JWT refresh token from user details
     *
     * @public
     * @param {IUser} user authenticated user
     * @returns {string} signed JWT
     * @memberof AuthController
     */
    async generateRefreshToken(user) {
        const body = { id: user.id, username: user.username };
        // generate jwt access token using jwt_secret
        const refreshToken = jsonwebtoken_1.default.sign({ user: body }, config_1.JWT_SECRET_REFRESHTOKEN, {
            expiresIn: "365d",
        });
        return refreshToken;
    }
    /**
     * get user details by email
     *
     * @public
     * @param {string} email
     * @returns user details
     * @memberof AuthController
     */
    async getUserDetailsByEmail(email) {
        // get user details by email
        const user = await User_1.UserModel.findOne({
            where: { email },
        });
        if (!user) {
            throw new app_error_1.AppError("No user exists with that email address.");
        }
        return user;
    }
    /**
     * Request for Password Reset
     *
     * @public
     * @param {string} password_reset_code
     * @param {Object} user
     * @returns updated
     * @memberof AuthController
     */
    async requestPasswordReset(password_reset_code, user) {
        // update password_reset_code of user model by id
        const updated = await User_1.UserModel.update({ password_reset_code }, {
            where: { id: user.id },
        });
        if (!updated) {
            throw new app_error_1.AppError("An error occurred");
        }
        return updated;
    }
    /**
     * Request for verify reset code
     *
     * @public
     * @param {string} code
     * @returns user
     * @memberof AuthController
     */
    async verifyResetCode(code) {
        // find user from user model by password_reset_code
        const user = await User_1.UserModel.findOne({
            where: { password_reset_code: code },
        });
        if (!user) {
            throw new app_error_1.AppError("Invalid password reset code");
        }
        return user;
    }
    /**
     * This function is responsible for reset password
     *
     * @public
     * @param {string} code
     * @param {string} password
     * @returns updated
     * @memberof AuthController
     */
    async resetPassword(code, password) {
        // find user by password reset code
        const user = await User_1.UserModel.findOne({
            where: { password_reset_code: code },
        });
        if (!user) {
            throw new app_error_1.AppError("User not found");
        }
        const hash = bcryptjs_1.default.hashSync(password, 10);
        // update password by user id
        const updated = await User_1.UserModel.update({ password: hash, password_reset_code: null, pass_updated: 1 }, {
            where: { id: user.id },
        });
        if (!updated) {
            throw new app_error_1.AppError("Could not update password");
        }
        return updated;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map