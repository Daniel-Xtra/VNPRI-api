"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const baseController_1 = require("../baseController");
const userService_1 = require("./userService");
/**
 * User controller
 *
 * @export
 * @class UserController
 */
class UserController extends baseController_1.BaseController {
    constructor() {
        super(...arguments);
        this._userService = new userService_1.UserService();
        this.index = () => {
            return this.sendResponse("hello!");
        };
        /**
         * This function is used for get user
         * @param username
         */
        this.getUser = async (username) => {
            // responsible for get user
            const user = await this._userService.getUser(username);
            return this.sendResponse(user);
        };
        /**
         * This function is used for update user
         * @param user
         * @param data
         */
        this.updateUser = async (user, data) => {
            // responsible for update user
            const updated = await this._userService.updateUser(user, data);
            return this.sendResponse(updated);
        };
        /**
         * This function is used for update status
         * @param status
         * @param user
         */
        this.getUserStatus = async (username) => {
            // responsible for get user status
            const user = await this._userService.getUserStatus(username);
            return this.sendResponse(user);
        };
        this.getBlockUsers = async (user) => {
            const block = await this._userService.getBlockUsers(user);
            return this.sendResponse(block);
        };
    }
}
exports.UserController = UserController;
//# sourceMappingURL=userController.js.map