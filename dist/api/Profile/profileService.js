"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const app_error_1 = require("./../../utils/app-error");
const _1 = require(".");
const User_1 = require("../User");
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