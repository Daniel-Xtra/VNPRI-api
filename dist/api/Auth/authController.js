"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const passport = require("passport");
const baseController_1 = require("../baseController");
const app_error_1 = require("./../../utils/app-error");
const User_1 = require("./../User");
const crypto_1 = __importDefault(require("crypto"));
const email_1 = require("../../utils/email");
const authService_1 = require("./authService");
/* Auth Controller
 *
 * @export
 * @class AuthController
 */
class AuthController extends baseController_1.BaseController {
    constructor() {
        super(...arguments);
        this._userService = new User_1.UserService();
        this._authService = new authService_1.AuthService();
        /**
         * This function is used for user login
         * @param req
         * @param res
         * @param next
         */
        this.login = async (req, res, next) => {
            // let body = req.body;
            // if (!body.code) {
            //   throw new AppError("Please update your app..");
            // }
            return new Promise((resolve, reject) => {
                return passport.authenticate("login", (err, user, info) => {
                    // check if not a user or have any error
                    if (!user || err) {
                        return reject(new app_error_1.AppError(info.message));
                    }
                    return req.login(user, { session: false }, async (error) => {
                        if (error) {
                            return reject(new app_error_1.AppError(error));
                        }
                        // responsible for generating access token
                        const token = await this._authService.generateToken(user);
                        // responsible for generating refresh token
                        const refreshToken = await this._authService.generateRefreshToken(user);
                        // responsible for getting user details
                        const userData = await this._userService.getUser(user.username);
                        // send userData , accessToken and refreshToken in response
                        resolve(this.sendResponse({
                            user: userData,
                            token,
                            refreshToken,
                        }));
                    });
                })(req, res, next);
            });
        };
        /**
         * This function is used for admin login
         * @param req
         * @param res
         * @param next
         */
        this.adminLogin = async (req, res, next) => {
            return new Promise((resolve, reject) => {
                return passport.authenticate("adminLogin", (err, user, info) => {
                    // check if not a admin_user or have any error
                    if (!user || err) {
                        return reject(new app_error_1.AppError(info.message));
                    }
                    return req.login(user, { session: false }, async (error) => {
                        if (error) {
                            return reject(new app_error_1.AppError(error));
                        }
                        // responsible for generating access token
                        const token = await this._authService.generateToken(user);
                        // responsible for generating refresh token
                        const refreshToken = await this._authService.generateRefreshToken(user);
                        // responsible for getting admin_user details
                        const userData = await this._userService.getUser(req.body.username);
                        // send admin_userData , accessToken and refreshToken in response
                        resolve(this.sendResponse({ user: userData, token, refreshToken }));
                    });
                })(req, res, next);
            });
        };
        /**
         * This function is used for signup
         * @param user
         */
        this.signup = async (user) => {
            //check for code for the new app
            // if (!user.code) {
            //   throw new AppError("Please update your app.");
            // }
            // responsible for generating access token
            const accessToken = await this._authService.generateToken(user);
            // responsible for getting user details
            const newUser = await this._userService.getUser(user.username);
            // responsible for generating refresh token
            const refreshToken = await this._authService.generateRefreshToken(user);
            // responsible for send mail after registered successfully
            let sent = email_1.sendMailAfterRegister(user);
            if (!sent) {
                throw new app_error_1.AppError("An error occurred");
            }
            return this.sendResponse({ user: newUser, token: accessToken, refreshToken }, "User registration successful");
        };
        /**
         * This function is used for generating new access and refresh token
         * @param token
         */
        this.refreshTokens = async (token) => {
            // responsible for verify the jwt token
            const userDetails = await this._authService.verifyJwtToken(token);
            // if jwt token verified then perform the next operation or not
            if (userDetails) {
                // responsible for generating new access token
                const token = await this._authService.generateToken(userDetails);
                // responsible for generating new refresh token
                const refreshToken = await this._authService.generateRefreshToken(userDetails);
                return this.sendResponse({ token, refreshToken });
            }
        };
        /**
         * This function is used for generating tokens by id
         * @param id
         */
        this.refreshTokensById = async (id, token) => {
            // responsble for find user details by id
            const user = await this._authService.findUserDetailsById(id);
            if (!user) {
                throw new app_error_1.AppError("Invalid user ID", null, 404);
            }
            // responsible for verify the jwt token
            const userDetails = await this._authService.verifyJwtToken(token);
            // Check if verified jwt token userId is same as given id or not
            if (userDetails.id == id) {
                // responsible for generating new access token
                const token = await this._authService.generateToken(userDetails);
                // responsible for generating new refresh token
                const refreshToken = await this._authService.generateRefreshToken(userDetails);
                return this.sendResponse({
                    token,
                    refreshToken,
                    username: userDetails.username,
                });
            }
            throw new app_error_1.AppError("UserId is not verified", null, 404);
        };
        /**
         * This function is used for logout
         * @param user
         */
        this.logout = async (user) => {
            // responsible for logout by user_id
            const updated = await this._authService.logout(user.id);
            if (updated) {
                return this.sendResponse("Logged out successfully.");
            }
        };
        /**
         * This function is used for request password reset
         * @param email
         */
        this.requestPasswordReset = async (email, body) => {
            // if (!body.code) {
            //   throw new AppError("Please update your app..");
            // }
            // responsible for get user details by email
            const user = await this._authService.getUserDetailsByEmail(email);
            // responsible for generate password reset code
            const password_reset_code = this.generatePasswordResetCode();
            // responsible for request password reset
            const updated = await this._authService.requestPasswordReset(password_reset_code, user);
            if (updated) {
                // responsible for send password reset code to email
                let sent = email_1.sendPasswordReset(password_reset_code, user);
                if (!sent) {
                    throw new app_error_1.AppError("An error occurred");
                }
                return this.sendResponse({
                    status: true,
                    message: `Reset password code has been sent to ${email}.`,
                    statusCode: 200,
                });
            }
        };
        /**
         * This function is used for verify reset code
         * @param code
         */
        this.verifyResetCode = async (code) => {
            // responsible for verify the reset code
            const isValid = await this._authService.verifyResetCode(code);
            return this.sendResponse(isValid);
            // if (isValid) {
            //   return this.sendResponse("Password reset code is valid");
            // }
        };
        /**
         * This function is used for reset password
         * @param code
         * @param password
         */
        this.resetPassword = async (code, password) => {
            // checking code and password both given or not
            if (!code || !password) {
                throw new app_error_1.AppError("Please provide both your password reset code and new password");
            }
            // responsible for reset password
            const resetDone = await this._authService.resetPassword(code, password);
            if (resetDone) {
                return this.sendResponse("Password reset successfully");
            }
        };
        /**
         * This function is used for validate username
         * @param code
         */
        this.validateUsername = async (username) => {
            // responsible for validate username
            const isValid = await this._authService.validateUsername(username);
            return this.sendResponse(isValid);
        };
        this.validateEmail = async (email) => {
            // responsible for validate email
            const isValid = await this._authService.validateEmail(email);
            return this.sendResponse(isValid);
        };
        this.validatePhone = async (phone) => {
            // responsible for validate phone
            const isValid = await this._authService.validatePhone(phone);
            return this.sendResponse(isValid);
        };
        /**
         * generate password reset code
         */
        this.generatePasswordResetCode = () => {
            return crypto_1.default.randomBytes(3).toString("hex");
        };
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map