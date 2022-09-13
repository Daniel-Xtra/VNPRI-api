"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const userModel_1 = require("../User/userModel");
const sequelize_1 = require("sequelize");
const helpers_1 = require("../../utils/helpers");
const profileModel_1 = require("../Profile/profileModel");
const app_error_1 = require("../../utils/app-error");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class AdminService {
    constructor() {
        /**
         * Get Admin Home
         * @param {Object} user the current user
         * @memberof AdminController
         */
        /**
         * Get All Topics
         * @param {Object} user the current user
         * @param {Number} per_page
         * @param {String} post_next
         * @param {String} post_prev
         * @memberof AdminController
         */
        this.getAllTopics = async (user, per_page = 15, post_next, post_prev) => {
            // responsible for paginate in post model
            throw new app_error_1.AppError("No topics found", null, 404);
        };
        /**
         * Get All Orders
         * @param {Object} user the current user
         * @param {Number} per_page
         * @param {String} order_next
         * @param {String} order_prev
         * @memberof AdminController
         */
        this.getAllOrders = async (user, per_page = 15, order_next, order_prev) => {
            // responsible for paginate orders by order_status
            throw new app_error_1.AppError("No order found", null, 404);
        };
        /**
         * Get All Users
         * @param {Object} user the current user
         * @param {Number} per_page
         * @param {String} post_next
         * @param {String} post_prev
         * @memberof AdminController
         */
        this.getAllUsers = async (user, per_page = 15, post_next, post_prev) => {
            const limit = Number(per_page);
            // responsible for paginate users with given limit
            let users = await userModel_1.UserModel.paginate({
                limit,
                desc: true,
                before: post_prev,
                after: post_next,
                attributes: [
                    "id",
                    "username",
                    "email",
                    "phone_number",
                    "first_name",
                    "last_name",
                    "gender",
                    "date_of_birth",
                    "membership_type",
                    "verified",
                    "socket_id",
                    "player_id",
                    "pass_updated",
                    "created_at",
                    "updated_at",
                ],
                where: {
                    membership_type: {
                        [sequelize_1.Op.ne]: "admin",
                    },
                },
                include: [
                    {
                        model: profileModel_1.ProfileModel,
                        attributes: {
                            exclude: helpers_1.PROFILE_EXCLUDES,
                        },
                    },
                ],
            });
            if (users) {
                // responsible for count total users
                const totalUsers = await userModel_1.UserModel.count();
                return {
                    users: users.results,
                    cursors: users.cursors,
                    totalUsers,
                };
            }
            throw new app_error_1.AppError("No users found", null, 404);
        };
        /**
         * Get all coupons
         * @param {Object} user the current user
         * @param {Number} per_page
         * @param {String} post_next
         * @param {String} post_prev
         * @returns users , cursors and total coupons on success
         * @memberof AdminController
         */
        this.getAllCoupons = async (user, per_page = 15, post_next, post_prev) => {
            throw new app_error_1.AppError("No Coupons found", null, 404);
        };
        /**
         * Get all docs couns
         * @param {Object} user the current user
         * @returns docsCouns on success
         * @memberof AdminController
         */
        this.getAllDocsCouns = async (user) => {
            // responsible for find all docsCouns by membership_type
            let DocsCouns = await userModel_1.UserModel.findAll({
                where: {
                    membership_type: {
                        [sequelize_1.Op.or]: ["doctor", "counsellor"],
                    },
                },
                attributes: [
                    "id",
                    "username",
                    "email",
                    "phone_number",
                    "first_name",
                    "last_name",
                    "gender",
                    "date_of_birth",
                    "membership_type",
                    "verified",
                    "socket_id",
                    "player_id",
                    "pass_updated",
                    "created_at",
                    "updated_at",
                ],
                include: [
                    {
                        model: profileModel_1.ProfileModel,
                        attributes: {
                            exclude: helpers_1.PROFILE_EXCLUDES,
                        },
                    },
                ],
            });
            if (DocsCouns) {
                return DocsCouns;
            }
            throw new app_error_1.AppError("No doctors/counsellors found", null, 404);
        };
        /**
         * Get all sessions
         * @param {Object} user the current user
         * @param {Number} per_page
         * @param {String} sess_next
         * @param {String} sess_prev
         * @returns users , cursors and totalSessions on success
         * @memberof AdminController
         */
        /**
         * Gets the list of user sessions available
         * @returns {Array<Objct>} on success
         * @memberof AdminController
         */
        /**
         * Updates a user resource
         * @public
         * @param {String} username the current user
         * @param {Object} data the data to be updated
         * @returns {(Object|null)} the updated user resource
         * @memberof AdminController
         */
        this.updateUser = async (username, data) => {
            if (data.username) {
                throw new app_error_1.AppError("Cannot edit username");
            }
            if (data.password) {
                data.password = bcryptjs_1.default.hashSync(data.password, 10);
            }
            // update user data by username
            const updated = await userModel_1.UserModel.update(data, { where: { username } });
            if (!updated) {
                throw new app_error_1.AppError("Could not update user data");
            }
            return await this.getUser(username);
        };
        /**
         * Get user
         * @param {String} username
         * @returns user on success
         * @memberof AdminController
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
                        model: profileModel_1.ProfileModel,
                        attributes: {
                            exclude: ["updated_at", "deleted_at", "userId"],
                        },
                    },
                ],
            });
            if (user) {
                return user;
            }
            throw new app_error_1.AppError(`User '${username}' not found.`, null, 404);
        };
        /**
         * Signup details
         * @param {Any} TODAY_START
         * @param {Any} NOW
         * @param {Any} WEEK_AGO
         * @param {Any} MONTH_AGO
         * @param {Any} YEAR_AGO
         * @returns user_counts on success
         * @memberof AdminController
         */
        /**
         * Topics details
         * @param {Any} TODAY_START
         * @param {Any} NOW
         * @param {Any} WEEK_AGO
         * @param {Any} MONTH_AGO
         * @param {Any} YEAR_AGO
         * @returns topic_counts on success
         * @memberof AdminController
         */
        this.topics_details = async (TODAY_START, NOW, WEEK_AGO, MONTH_AGO, YEAR_AGO) => { };
        /**
         * Comments details
         * @param {Any} TODAY_START
         * @param {Any} NOW
         * @param {Any} WEEK_AGO
         * @param {Any} MONTH_AGO
         * @param {Any} YEAR_AGO
         * @returns topic_counts on success
         * @memberof AdminController
         */
        this.comments_details = async (TODAY_START, NOW, WEEK_AGO, MONTH_AGO, YEAR_AGO) => { };
        /**
         * Search user admin
         * @param {String} query
         * @param {String} filter
         * @param {Object} user the current user
         * @param {Number} per_page
         * @param {String} search_next
         * @param {String} search_prev
         * @returns results ,cursors and total search on success
         * @memberof AdminController
         */
        this.searchUserAdmin = async (query, filter, user, per_page = 15, search_next, search_prev) => {
            const limit = Number(per_page);
            let results;
            let totalSearch;
            if (filter == "posts") {
            }
            else if (filter == "users") {
                results = await userModel_1.UserModel.paginate({
                    limit,
                    desc: true,
                    before: search_prev,
                    after: search_next,
                    where: {
                        [sequelize_1.Op.or]: [
                            {
                                username: {
                                    [sequelize_1.Op.like]: `%${query}%`,
                                },
                            },
                            {
                                email: {
                                    [sequelize_1.Op.like]: `%${query}%`,
                                },
                            },
                            {
                                phone_number: {
                                    [sequelize_1.Op.like]: `%${query}%`,
                                },
                            },
                        ],
                    },
                    attributes: {
                        exclude: [
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
                        ],
                    },
                    include: [
                        {
                            model: profileModel_1.ProfileModel,
                            attributes: {
                                exclude: [
                                    "religion",
                                    "sexual_orientation",
                                    "relationship_status",
                                    "occupation",
                                    "ethnic_group",
                                    "highest_education",
                                    "current_education",
                                    "created_at",
                                    "updated_at",
                                    "deleted_at",
                                    "userId",
                                ],
                            },
                        },
                    ],
                });
                // responsible for count total search
                totalSearch = await userModel_1.UserModel.count();
            }
            if (results) {
                return {
                    results: results.results,
                    cursors: results.cursors,
                    totalSearch,
                };
            }
            return "no results";
        };
    }
}
exports.AdminService = AdminService;
//week
// SELECT YEAR(created_at) AS Year, DATE_FORMAT(created_at, '%Y/%v') AS Week, COUNT(*) AS total
//FROM users
//GROUP BY Year, Week;
//day
// SELECT YEAR(created_at) AS Year,DATE_FORMAT(created_at, '%Y/%m/%d') AS Day, COUNT(*) AS total
// FROM users
// GROUP BY Year,Day;
// months
// SELECT YEAR(created_at) AS Year,DATE_FORMAT(created_at, '%Y/%m') AS Month, COUNT(*) AS total
// FROM users
// GROUP BY Year,Month;
//Year
// SELECT YEAR(created_at) AS Year, COUNT(*) AS total
// FROM users
// GROUP BY Year;
//# sourceMappingURL=adminService.js.map