"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const _1 = require(".");
const app_error_1 = require("../../utils/app-error");
const User_1 = require("../User");
const Profile_1 = require("../Profile");
const helpers_1 = require("../../utils/helpers");
class NotificationService {
    constructor() {
        /**
         * Creates new notification for user
         * @param {Object} user the current user
         * @param {Object} notification the notification data
         * @returns {(string|null)} the notification success message
         * @memberof NotificationController
         */
        this.createNotification = async (userId, notification) => {
            // check if notification context and message both have or not
            if (!notification.context || !notification.message) {
                throw new app_error_1.AppError("Notification data incomplete");
            }
            // find user from user model by userId
            const user = await User_1.UserModel.findByPk(userId);
            if (!user) {
                throw new app_error_1.AppError("Cannot find user");
            }
            // create notification
            const saved = await _1.NotificationModel.create(notification);
            if (saved && user.addNotification(saved)) {
                return "notification saved";
            }
            throw new app_error_1.AppError("Could not create notification");
        };
        /**
         * Gets all user's notifications
         * @param {Object} user the current user
         * @returns notifications
         * @memberof NotificationController
         */
        this.getUserNotifications = async (user) => {
            // append the notifications
            const notifications = await this.appendData(user);
            if (notifications) {
                // count total unread notifications of current user by user_id
                const totalUnreads = await _1.NotificationModel.count({
                    where: { is_read: false, user_id: user.id },
                });
                return {
                    notifications,
                    unreads: totalUnreads,
                };
            }
            throw new app_error_1.AppError("No notifications.", null, 404);
        };
        /**
         * Mark all notifications as read
         * @param {Object} user the current user
         * @returns notifications
         * @memberof NotificationController
         */
        this.markAllNotificationsAsRead = async (user) => {
            const data = {
                is_read: true,
            };
            // update the current user's read statement by user_id
            const updated = await _1.NotificationModel.update(data, {
                where: { user_id: user.id },
            });
            if (updated) {
                // get current user's notifications
                const notifications = await this.appendData(user);
                // count total unread notifications of current user by userId
                const totalUnreads = await _1.NotificationModel.count({
                    where: { is_read: false, user_id: user.id },
                });
                return {
                    notifications,
                    unreads: totalUnreads,
                };
            }
            throw new app_error_1.AppError("No unread notifications", null, 400);
        };
        /**
         * Gets all notification as read
         * @param {Object} user the current user
         * @param {String} id notification id
         * @returns notifications
         * @memberof NotificationController
         */
        this.markOneNotificationAsRead = async (user, id) => {
            const data = {
                is_read: true,
            };
            // update the current user's read statement by user_id
            const updated = await _1.NotificationModel.update(data, {
                where: {
                    id,
                },
            });
            if (updated) {
                // get current user's notifications
                const notifications = await this.appendData(user);
                // count total unread notifications of the current user by user_id
                const totalUnreads = await _1.NotificationModel.count({
                    where: { is_read: false, user_id: user.id },
                });
                return {
                    notifications,
                    unreads: totalUnreads,
                };
            }
        };
        /**
         * Get notification settings
         * @param {Object} user the current user
         * @returns notification settings
         * @memberof NotificationController
         */
        this.getNotificationSettings = async (user) => {
            // get current user's notification settings
            let settings = await user.getSettings();
            if (!settings) {
                // create notification settings
                const saved = await User_1.SettingModel.create();
                await user.setSettings(saved);
                settings = await user.getSettings();
            }
            let settingsJSON = settings.toJSON();
            return settingsJSON;
        };
        /**
         * Save notification settings
         * @param {Object} user the current user
         * @param {Object} settings ISettings
         * @returns updated
         * @memberof NotificationController
         */
        this.saveNotificationSettings = async (user, settings) => {
            // update current user's settings by user_id
            const updated = await User_1.SettingModel.update(settings, {
                where: { settingId: user.id },
            });
            if (!updated) {
                throw new app_error_1.AppError("Unable to update notification settings.");
            }
            return await this.getNotificationSettings(user);
        };
        /**
         * Save device
         * @param {Object} user the current user
         * @param {String} token
         * @returns {String} on success
         * @memberof NotificationController
         */
        this.saveDevice = async (user, token) => {
            // update player_id of current user by user_id
            const saved = await User_1.UserModel.update({ player_id: token }, {
                where: { id: user.id },
            });
            if (!saved) {
                throw new app_error_1.AppError("Could not save device token");
            }
            return "Saved token";
        };
        /**
         * Append data
         * @param user
         * @returns notifications on success
         * @memberof NotificationController
         */
        this.appendData = async (user) => {
            // find all notifications by user id
            const allNotification = await _1.NotificationModel.findAll({
                where: {
                    user_id: user.id,
                },
                order: [["created_at", "desc"]],
                include: [
                    {
                        model: User_1.UserModel,
                        as: "user",
                        attributes: {
                            exclude: helpers_1.USER_EXCLUDES_FOR_APPENDDATA,
                        },
                        include: [
                            {
                                model: Profile_1.ProfileModel,
                                attributes: {
                                    exclude: helpers_1.PROFILE_EXCLUDES,
                                },
                            },
                        ],
                    },
                ],
            });
            if (!allNotification) {
                throw new app_error_1.AppError("No notifications.", null, 404);
            }
            return JSON.parse(JSON.stringify(allNotification));
        };
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notificationService.js.map