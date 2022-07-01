"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = require("./userModel");
const app_error_1 = require("../../utils/app-error");
const Profile_1 = require("../Profile");
const helpers_1 = require("../../utils/helpers");
const moment_1 = __importDefault(require("moment"));
const _1 = require(".");
const database_1 = require("../../shared/database");
class UserService {
    constructor() {
        /**
         * Function responsible for get user
         * @param {string} username
         * @returns user
         * @memberof UserController
         */
        this.getUser = async (username) => {
            // find user from user model by username
            let user = await userModel_1.UserModel.findOne({
                where: { username },
                attributes: {
                    exclude: ["password", "email_verification_code", "auth_key"],
                },
                include: [
                    {
                        model: Profile_1.ProfileModel,
                        required: true,
                        attributes: {
                            exclude: ["updated_at", "deleted_at", "userId"],
                        },
                    },
                    {
                        model: _1.AccountModel,
                        as: "accounts",
                        required: false,
                        attributes: {
                            exclude: ["updated_at", "deleted_at", "userId"],
                        },
                    },
                ],
            });
            // check if user exists then the next operation can perform,or not
            if (user) {
                return user;
            }
            throw new app_error_1.AppError(`User '${username}' not found.`, null, 404);
        };
        /**
         * Updates a user resource
         * @public
         * @param {Object} user the current user
         * @param {Object} data the data to be updated
         * @returns {(Object|null)} the updated user resource
         * @memberof UserController
         */
        this.updateUser = async (user, data) => {
            let username = user.username;
            // let new_username = user.username;
            if (data.username) {
                // check if username updated
                if (user.username_updated) {
                    throw new app_error_1.AppError("Cannot edit username");
                }
                if (data.username != username) {
                    // username = data.username;
                    data.username_updated = 1;
                }
            }
            if (data.password) {
                // bcrypt the password
                data.password = bcryptjs_1.default.hashSync(data.password, 10);
            }
            if (data.username != username) {
                // update user name
                const updated = await userModel_1.UserModel.update(data, { where: { username } });
                if (!updated) {
                    throw new app_error_1.AppError("Could not update user data");
                }
                username = data.username;
                return await this.getUser(username);
            }
            // username = user.username;
            const updated = await userModel_1.UserModel.update(data, { where: { username } });
            if (!updated) {
                throw new app_error_1.AppError("Could not update user data");
            }
            return await this.getUser(username);
        };
        /**
         * Get user status
         * @param {string} username of user
         * @returns user
         * @memberof UserController
         */
        this.getUserStatus = async (username) => {
            // find user from user model by username
            let user = await userModel_1.UserModel.findOne({
                where: { username },
                attributes: {
                    exclude: helpers_1.USER_EXCLUDES,
                },
                include: [
                    {
                        model: _1.UserConnectionsModel,
                        attributes: ["socket_id"],
                    },
                ],
            });
            if (user) {
                user = user.toJSON();
                // user.isOnline = user.socket_id != null ? true : false;
                user.isOnline =
                    user.user_connections && user.user_connections.length > 0
                        ? true
                        : false;
                delete user.user_connections;
                return user;
            }
            throw new app_error_1.AppError(`User ${username} not found`, null, 404);
        };
        /**
         * Update doctor status
         * @param {string} status
         * @param {string} user
         * @returns user
         * @memberof UserController
         */
        this.updateStatus = async (status, user) => {
            let data = {};
            let now_momemnt = moment_1.default();
            let today_rate;
            // check status is true or false
            if (status == "true") {
                data.online_time = now_momemnt.toDate();
                const saved = await _1.AccountModel.create(data);
                // update user_status of user model by username
                const updated = await userModel_1.UserModel.update({ user_status: status }, { where: { username: user.username } });
                if (saved && user.addAccounts(saved) && updated) {
                    let username = user.username;
                    return await this.getUser(username);
                }
                throw new app_error_1.AppError("Could not save user data");
            }
            else {
                // find today_rate from account model by userId
                today_rate = await _1.AccountModel.findOne({
                    where: {
                        offline_time: "",
                        userId: user.id,
                    },
                });
                // check today_rate is present or not
                if (!today_rate) {
                    data.online_time = user.updated_at;
                    const saved = await _1.AccountModel.create(data);
                    today_rate = await user.addAccounts(saved);
                }
                data.offline_time = now_momemnt.toDate();
                data.hour_used = moment_1.default
                    .duration(moment_1.default(data.offline_time).diff(today_rate.online_time))
                    .hours();
                // update account of account model by userId
                const updated_account = await _1.AccountModel.update(data, {
                    where: { userId: user.id },
                });
                // update user_status of user model by username
                const updated = await userModel_1.UserModel.update({ user_status: status }, { where: { username: user.username } });
                if (!updated && !updated_account) {
                    throw new app_error_1.AppError("Could not update user data");
                }
                let username = user.username;
                // return user
                return await this.getUser(username);
            }
        };
        this.getBlockUsers = async (user) => {
            // const blockedUsers = await BlockListModel.findAll({ where: { block_id: user.id } });
            const blockedUsers = await database_1.DB.query(`SELECT U.id,U.username,U.email,U.first_name,
        U.last_name,U.gender,U.membership_type,U.verified,
        PR.profile_picture_url
        FROM block_users AS B JOIN users AS U ON B.user_id = U.id
        LEFT JOIN profiles PR ON PR.user_id = U.id WHERE B.block_id =${user.id}`, {
                type: database_1.DB.QueryTypes.SELECT,
            });
            if (blockedUsers) {
                return blockedUsers;
            }
            throw new app_error_1.AppError(`Blocked Users not found`, null, 404);
        };
    }
}
exports.UserService = UserService;
//# sourceMappingURL=userService.js.map