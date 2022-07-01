"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const baseController_1 = require("../baseController");
const notificationService_1 = require("./notificationService");
/**
 * Notification controller
 *
 * @export
 * @class NotificationController
 */
class NotificationController extends baseController_1.BaseController {
    constructor() {
        super(...arguments);
        this._notificationService = new notificationService_1.NotificationService();
        this.index = () => {
            return this.sendResponse('notifications');
        };
        /**
         * This function is used for get user notifications
         * @param user
         */
        this.getUserNotifications = async (user) => {
            // responsible for get user notifications
            const notifications = await this._notificationService.getUserNotifications(user);
            return this.sendResponse(notifications);
        };
        /**
         * This function is used for mark all notification as read
         * @param user
         */
        this.readAll = async (user) => {
            // responsible for mark all notifications as read
            const updated = await this._notificationService.markAllNotificationsAsRead(user);
            return this.sendResponse(updated);
        };
        /**
         * This function is used for mark one notification as read
         * @param user
         * @param id
         */
        this.readOne = async (user, id) => {
            // responsible for mark one notification as read
            const updated = await this._notificationService.markOneNotificationAsRead(user, id);
            return this.sendResponse(updated);
        };
        /**
         * This function is used for get notification settings
         * @param user
         */
        this.getSettings = async (user) => {
            // responsible for get notification settings
            const settings = await this._notificationService.getNotificationSettings(user);
            return this.sendResponse(settings);
        };
        /**
         * This function is used for update settings
         * @param user
         * @param data
         */
        this.updateSettings = async (user, data) => {
            // responsible for save notification settings
            const settings = await this._notificationService.saveNotificationSettings(user, data);
            return this.sendResponse(settings);
        };
        /**
         * This function is used for save device
         * @param user
         * @param data
         */
        this.saveDevice = async (user, data) => {
            // responsible for save device
            const updated = await this._notificationService.saveDevice(user, data.token);
            return this.sendResponse(updated);
        };
    }
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=notificationController.js.map