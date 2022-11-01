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
    }
}
exports.UserService = UserService;
//# sourceMappingURL=userService.js.map