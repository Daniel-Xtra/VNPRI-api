"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtStrategy = exports.adminLoginStrategy = exports.loginStrategy = exports.adminSignupStrategy = exports.signupStrategy = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const sha1_1 = __importDefault(require("sha1"));
const lodash_1 = __importDefault(require("lodash"));
const passport_jwt_1 = require("passport-jwt");
const passport_local_1 = require("passport-local");
const User_1 = require("../api/User");
const index_1 = require("./../config/index");
const app_error_1 = require("./../utils/app-error");
const Profile_1 = require("../api/Profile");
const sequelize_1 = require("sequelize");
const validator_1 = __importDefault(require("validator"));
/**
 * This function is used for signup strategy
 * @param req
 * @param username
 * @param password
 * @param done
 */
exports.signupStrategy = new passport_local_1.Strategy({
    usernameField: "username",
    passwordField: "username",
    passReqToCallback: true,
}, async (req, username, password, done) => {
    try {
        const body = lodash_1.default.pick(req.body, [
            "username",
            "email",
            "phone_number",
            "first_name",
            "last_name",
            "gender",
        ]);
        // TODO: check for username , phone number and email address
        const checkDuplicateOrNot = await User_1.UserModel.findOne({
            where: {
                [sequelize_1.Op.or]: [
                    { username: body.username },
                    { email: body.email },
                    { phone_number: body.phone_number },
                ],
            },
            raw: true,
        });
        if (checkDuplicateOrNot) {
            if (checkDuplicateOrNot.username == body.username) {
                return done(new app_error_1.AppError(`An account with that username already exists.`));
            }
            else if (checkDuplicateOrNot.email == body.email) {
                return done(new app_error_1.AppError(`An account with that email already exists`));
            }
            else if (checkDuplicateOrNot.phone_number == body.phone_number) {
                return done(new app_error_1.AppError(`Sorry, that phone number is already in use.`));
            }
        }
        password = "123456";
        const passwordHash = bcryptjs_1.default.hashSync(password, 10);
        const emailVerificationCode = generateEmailVerificationCode();
        // create new user
        const user = await User_1.UserModel.create({
            username,
            password: passwordHash,
            membership_type: "user",
            email_verification_code: emailVerificationCode,
            pass_updated: 1,
            ...body,
        });
        const profile = await Profile_1.ProfileModel.create();
        const notificationSettings = await User_1.SettingModel.create();
        await user.setProfile(profile);
        await user.setSettings(notificationSettings);
        // Send the user information to the next middleware
        return done(null, user);
    }
    catch (error) {
        done(Error(error));
    }
});
exports.adminSignupStrategy = new passport_local_1.Strategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true,
}, async (req, username, password, done) => {
    try {
        const body = lodash_1.default.pick(req.body, [
            "username",
            "email",
            "phone_number",
            "first_name",
            "last_name",
            "gender",
        ]);
        // TODO: check for username , phone number and email address
        const checkDuplicateOrNot = await User_1.UserModel.findOne({
            where: {
                [sequelize_1.Op.or]: [
                    { username: body.username },
                    { email: body.email },
                    { phone_number: body.phone_number },
                ],
            },
            raw: true,
        });
        if (checkDuplicateOrNot) {
            if (checkDuplicateOrNot.username == body.username) {
                return done(new app_error_1.AppError(`An account with that username already exists.`));
            }
            else if (checkDuplicateOrNot.email == body.email) {
                return done(new app_error_1.AppError(`An account with that email already exists`));
            }
            else if (checkDuplicateOrNot.phone_number == body.phone_number) {
                return done(new app_error_1.AppError(`Sorry, that phone number is already in use.`));
            }
        }
        const passwordHash = bcryptjs_1.default.hashSync(password, 10);
        const emailVerificationCode = generateEmailVerificationCode();
        // create new user
        const user = await User_1.UserModel.create({
            username,
            password: passwordHash,
            email_verification_code: emailVerificationCode,
            pass_updated: 1,
            membership_type: "admin",
            ...body,
        });
        const profile = await Profile_1.ProfileModel.create();
        const notificationSettings = await User_1.SettingModel.create();
        await user.setProfile(profile);
        await user.setSettings(notificationSettings);
        // Send the user information to the next middleware
        return done(null, user);
    }
    catch (error) {
        done(Error(error));
    }
});
/**
 * This function is used for login strategy
 * @param username
 * @param password
 * @param done
 */
exports.loginStrategy = new passport_local_1.Strategy({
    usernameField: "username",
    passwordField: "password",
}, async (username, password, done) => {
    try {
        let loginFailed = false;
        let user;
        if (validator_1.default.isEmail(username)) {
            // find user by username
            user = (await User_1.UserModel.findOne({ where: { email: username } }));
        }
        else {
            // find user by username
            user = await User_1.UserModel.findOne({ where: { username } });
        }
        if (user) {
            let validate;
            const pass_updated = user.pass_updated;
            if (pass_updated == 0) {
                if (sha1_1.default(password) != user.password) {
                    validate = false;
                }
                else {
                    const passwordHash = bcryptjs_1.default.hashSync(password, 10);
                    await User_1.UserModel.update({ password: passwordHash, pass_updated: 1 }, { where: { username: user.username } });
                    validate = await bcryptjs_1.default.compare(password, passwordHash);
                }
            }
            else {
                validate = await bcryptjs_1.default.compare(password, user.password);
            }
            if (!validate) {
                loginFailed = true;
            }
        }
        else {
            loginFailed = true;
        }
        if (loginFailed) {
            return done(null, false, {
                message: "Incorrect username/email or password.",
            });
        }
        // Send the user information to the next middleware
        return done(null, user, { message: "Logged in Successfully" });
    }
    catch (error) {
        return done(error);
    }
});
/**
 * This function is used for admin login strategy
 * @param username
 * @param password
 * @param done
 */
exports.adminLoginStrategy = new passport_local_1.Strategy({
    usernameField: "username",
    passwordField: "password",
}, async (username, password, done) => {
    try {
        let loginFailed = false;
        // find user by username
        const user = await User_1.UserModel.findOne({ where: { username } });
        if (user) {
            // check membership type is admin or not
            if (user.membership_type == "admin") {
                let validate;
                const pass_updated = user.pass_updated;
                if (pass_updated == 0) {
                    if (sha1_1.default(password) != user.password) {
                        validate = false;
                    }
                    else {
                        const passwordHash = bcryptjs_1.default.hashSync(password, 10);
                        await User_1.UserModel.update({ password: passwordHash, pass_updated: 1 }, { where: { username } });
                        validate = await bcryptjs_1.default.compare(password, passwordHash);
                    }
                }
                else {
                    validate = await bcryptjs_1.default.compare(password, user.password);
                }
                if (!validate) {
                    loginFailed = true;
                }
            }
            else {
                return done(null, false, {
                    message: "You are not authorized to login.",
                });
            }
        }
        else {
            loginFailed = true;
        }
        if (loginFailed) {
            return done(null, false, {
                message: "Incorrect username or password.",
            });
        }
        // Send the user information to the next middleware
        return done(null, user, { message: "Logged in Successfully" });
    }
    catch (error) {
        return done(error);
    }
});
/**
 * This function is used for jwt strategy
 * @param token
 * @param done
 */
exports.jwtStrategy = new passport_jwt_1.Strategy({
    secretOrKey: index_1.JWT_SECRET,
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
}, async (token, done) => {
    try {
        // Pass the user details to the next middleware
        return done(null, token.user);
    }
    catch (error) {
        done(error);
    }
});
/**
 * generates unique code for email verification
 * @returns {string} hexadecimal string
 */
function generateEmailVerificationCode() {
    // generate email verification code
    const str = crypto_1.default.randomBytes(20).toString("hex");
    return str;
}
//# sourceMappingURL=passport.js.map