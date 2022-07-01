"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_INCLUDES = exports.USER_EXCLUDES_FOR_APPENDDATA = exports.PROFILE_EXCLUDES = exports.USER_EXCLUDES = exports.getMomentTime = exports.getUserShadowBalance = exports.hasCouponExpired = exports.isSubActive = exports.hasPollExpired = exports.getMomentTimeDiff = exports.unAuthModifyPosts = exports.getOffsetValue = exports.mkdirP = void 0;
const moment_1 = __importDefault(require("moment"));
const Session_1 = require("../api/Session");
const fs_1 = __importDefault(require("fs"));
const bluebird_1 = __importDefault(require("bluebird"));
const fs = bluebird_1.default.promisifyAll(fs_1.default);
const _sessions = new Session_1.SessionService();
const mkdirP = async (directory) => {
    try {
        return await fs.mkdirAsync(directory);
    }
    catch (error) {
        if (error.code != "EEXIST") {
            throw error;
        }
    }
};
exports.mkdirP = mkdirP;
/**
 * gets offset value
 * @param page
 * @param limit
 */
const getOffsetValue = (page, limit) => {
    let offset = 0;
    if (page == 1) {
        return offset;
    }
    else if (page == 2) {
        return limit++;
    }
    let prev = page - 1;
    offset = prev * limit;
    return offset;
};
exports.getOffsetValue = getOffsetValue;
const unAuthModifyPosts = async (posts, single) => {
    // const follows = await user.getFollows();
    // check if membership_type is user then get the current user's sessions else find all sessions from session model by with_user
    // let sessions =
    //   user.membership_type == "user"
    //     ? await user.getSessions()
    //     : await SessionModel.findAll({ where: { with_user: user.id } });
    if (!single) {
        const modified = await Promise.all(posts.map(async (post) => {
            let postAsJson = post.toJSON();
            postAsJson.isUserFollowing = false;
            // check isBlocked or not
            postAsJson.isBlockedByUser = false;
            // check paddiListed or not
            postAsJson.isPaddiListed = false;
            postAsJson.user.sessionStatus = null;
            // check isSubActive or not
            postAsJson.user.isSubActive = false;
            return postAsJson;
        }));
        return modified;
    }
    let singlePost = posts.toJSON();
    singlePost.isUserFollowing = false;
    // check isBlocked by user or not
    singlePost.isBlockedByUser = false;
    // check isPaddiListed or not
    singlePost.isPaddiListed = false;
    return singlePost;
};
exports.unAuthModifyPosts = unAuthModifyPosts;
/**
 * get moment time difference
 * @param arr
 */
const getMomentTimeDiff = async (arr) => {
    let datenow = new Date().getTime();
    let expires = new Date(arr);
    let time_diff = datenow - expires.getTime();
    let duration = await Math.round(time_diff / (1000 * 3600 * 24));
    return duration;
};
exports.getMomentTimeDiff = getMomentTimeDiff;
/**
 * has poll expired
 * @param expires
 */
const hasPollExpired = (expires) => {
    if (!expires) {
        return null;
    }
    return moment_1.default().isAfter(expires) ? true : false;
};
exports.hasPollExpired = hasPollExpired;
/**
 * is subactive
 * @param expires
 */
const isSubActive = (expires) => {
    return moment_1.default().isBefore(expires) ? true : false;
};
exports.isSubActive = isSubActive;
/**
 * coupon expired or not
 * @param expires
 */
const hasCouponExpired = (expires) => {
    return moment_1.default().isBefore(expires) ? true : false;
};
exports.hasCouponExpired = hasCouponExpired;
/**
 * get user shadow balance
 * @param user
 */
const getUserShadowBalance = async (user) => {
    const sub = await user.getSubscription();
    // get active sessions
    const activeSessions = await _sessions.getActiveSessions(user.id);
    let credit = 0;
    credit += activeSessions * 500;
    return sub.coin_balance - credit;
};
exports.getUserShadowBalance = getUserShadowBalance;
/**
 * get moment time
 * @param arr
 */
const getMomentTime = (arr, currentExpire) => {
    let now = moment_1.default();
    if (currentExpire) {
        let isSub = exports.isSubActive(currentExpire);
        if (isSub) {
            let dateToUSe = moment_1.default(currentExpire);
            return dateToUSe.add(...arr).toDate();
        }
    }
    return now.add(...arr).toDate();
};
exports.getMomentTime = getMomentTime;
/**
 * WooCommerce
 */
/**
 * user excludes
 */
exports.USER_EXCLUDES = [
    "email",
    "phone_number",
    "password",
    "first_name",
    "last_name",
    "date_of_birth",
    "email_verification_code",
    "reset_password_code",
    "refresh_token",
    "auth_key",
    "updated_at",
    "deleted_at",
];
/**
 * profile excludes
 */
exports.PROFILE_EXCLUDES = [
    "relationship_status",
    "occupation",
    "highest_education",
    "current_education",
    "created_at",
    "updated_at",
    "deleted_at",
    "userId",
];
/**
 * user excludes for append data
 */
exports.USER_EXCLUDES_FOR_APPENDDATA = [
    "email",
    "phone_number",
    "password",
    "first_name",
    "last_name",
    "date_of_birth",
    "email_verification_code",
    "socket_id",
    "auth_key",
    "updated_at",
    "deleted_at",
    "userId",
];
exports.USER_INCLUDES = [
    "id",
    "username",
    "email",
    "phone_number",
    "first_name",
    "last_name",
    "gender",
    "date_of_birth",
];
//# sourceMappingURL=helpers.js.map