"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const baseController_1 = require("../baseController");
const profileService_1 = require("./profileService");
/**
 * Profile controller
 *
 * @export
 * @class ProfileController
 */
class ProfileController extends baseController_1.BaseController {
    constructor() {
        super(...arguments);
        this._profileService = new profileService_1.ProfileService();
        this.index = () => {
            return this.sendResponse("profile");
        };
        /**
         * This function is used for get profile
         * @param username
         */
        this.getProfile = async (username) => {
            // responsible for get user profile
            const user = await this._profileService.getUserProfile(username);
            return this.sendResponse(user);
        };
        /**
         * This function is used for edit profile
         * @param user the current user
         * @param profile
         */
        this.editProfile = async (user, profile) => {
            // responsible for edit profile
            const updated = await this._profileService.editProfile(user, profile);
            return this.sendResponse(updated);
        };
        /**
         * Calls sevice to save uploaded profile photo
         *
         * @param {Object} user the current user
         * @param {Object} photo the uploaded photo with properties
         */
        this.saveProfilePhoto = async (user, photo) => {
            // responsible for save profile photo
            const profile = await this._profileService.saveProfilePhoto(user, photo);
            return this.sendResponse(profile);
        };
    }
}
exports.ProfileController = ProfileController;
//# sourceMappingURL=profileController.js.map