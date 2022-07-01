"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const app_error_1 = require("./../../utils/app-error");
const _1 = require(".");
const User_1 = require("../User");
const sequelize_1 = require("sequelize");
const moment_1 = __importDefault(require("moment"));
const database_1 = require("../../shared/database");
const { cloudinary } = require("../../middleware/cloudinary");
// require("dotenv").config;
class ProfileService {
    constructor() {
        /**
         * Gets the user profile
         * @param {string} username the username to look up
         * @returns profile or null
         * @memberof ProfileController
         */
        // public getUserProfile = async (username: string) => {
        //   // find user from user model by username
        //   const user = await UserModel.findOne({ where: { username } });
        //   if (user) {
        //     // get user profile excluding id and user_id
        //     const profile = await user.getProfile({
        //       attributes: { exclude: ["id", "user_id"] },
        //     });
        //     return profile ? profile : null;
        //   }
        //   return `User with ${username} not found`;
        // };
        this.getUserProfile = async (username) => {
            // find user from user model by username
            const user = await User_1.UserModel.findOne({ where: { username } });
            if (user) {
                // get user profile excluding id and user_id
                const profile = await _1.ProfileModel.findOne({
                    where: { user_id: user.id },
                    attributes: {
                        exclude: ["id", "user_id"],
                    },
                    raw: true,
                });
                // get total number of paddi
                return profile ? profile : null;
            }
            return `User with ${username} not found`;
        };
        /**
         * Update a user profile
         *
         * @param {Object} user the current user
         * @param {Object} profile the profile data to save
         * @returns {Object} the updated profile
         * @memberof ProfileController
         */
        this.editProfile = async (user, profile) => {
            const hasProfile = (await user.getProfile()) ? true : false;
            if (hasProfile) {
                // update profile of a user by user_id
                let updated = await _1.ProfileModel.update(profile, {
                    where: { user_id: user.id },
                });
                if (updated) {
                    // return user profile
                    return await this.getUserProfile(user.username);
                }
                throw new app_error_1.AppError("Could not update user profile");
            }
            else {
                // create profile in profile model
                const saved = await _1.ProfileModel.create(profile);
                if (saved && user.setProfile(saved)) {
                    return await this.getUserProfile(user.username);
                }
                throw new app_error_1.AppError("Could not create user profile");
            }
        };
        /**
         * Used for get doctors progress
         *
         * @param {String} username of user
         * @memberof ProfileController
         */
        this.getDoctorsProgress = async (username) => {
            // find user from user model by username
            const user = await User_1.UserModel.findOne({ where: { username } });
            let now_momemnt = moment_1.default();
            let NOW = new Date();
            const TODAY_DATE = now_momemnt.toDate();
            let TODAY_START = NOW;
            // find today_rate from account model by today start and end time
            let today_rate = await User_1.AccountModel.findOne({
                where: {
                    online_time: {
                        [sequelize_1.Op.gt]: TODAY_START,
                        [sequelize_1.Op.lt]: TODAY_DATE,
                    },
                    userId: user.id,
                },
            });
            let compute = {
                hour_used: 0,
                percentage: "",
                amount_earned: 0,
                amount_percnt: "",
            };
            if (today_rate) {
                if (!today_rate.offline_time) {
                    today_rate.offline_time = now_momemnt.toDate();
                }
                compute.hour_used = moment_1.default
                    .duration(moment_1.default(today_rate.offline_time).diff(today_rate.online_time))
                    .hours();
                compute.percentage = Math.round((today_rate.hour_used / 24) * 100) + "%";
                compute.amount_earned = today_rate.hour_used * 200;
                const total_amnt = 200 * 24;
                compute.amount_percnt =
                    Math.round((compute.amount_earned / total_amnt) * 100) + "%";
            }
            const total_patients = await database_1.DB.query(`
        SELECT DISTINCT users.id from chats
          LEFT JOIN users ON users.id = user_id WHERE chats.sent_to = ${user.id}

          UNION

          SELECT DISTINCT users.id from chats
          LEFT JOIN users ON users.id = sent_to WHERE chats.user_id = ${user.id}`, {
                type: database_1.DB.QueryTypes.SELECT,
            });
            return { today_rate, compute, total_patients: total_patients.length };
        };
        /**
         * Saves uploaded profile photo
         *
         * @param {Object} user the current user
         * @param {Object} photo the uploaded photo with properties
         * @returns {Object} the updated profile data
         * @memberof ProfileController
         */
        this.saveProfilePhoto = async (user, photo) => {
            console.log(photo);
            const result = await cloudinary.uploader
                .upload(photo.path, { folder: "Profile" }, function (result) {
                return result;
            })
                .catch((error) => console.log(error));
            console.log(result);
            const profileData = {
                profile_picture_url: result.secure_url,
            };
            const hasProfile = (await user.getProfile()) ? true : false;
            if (hasProfile) {
                // update profile of user by user_id
                let updated = await _1.ProfileModel.update(profileData, {
                    where: { user_id: user.id },
                });
                if (updated) {
                    return await this.getUserProfile(user.username);
                }
                throw new app_error_1.AppError("Could not update profile picture");
            }
            else {
                // create and save profile
                const saved = await _1.ProfileModel.create(profileData);
                if (saved && user.setProfile(saved)) {
                    return await this.getUserProfile(user.username);
                }
                throw new app_error_1.AppError("Could not update profile picture");
            }
        };
    }
}
exports.ProfileService = ProfileService;
//# sourceMappingURL=profileService.js.map