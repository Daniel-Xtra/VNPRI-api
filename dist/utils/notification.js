"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const Notification_1 = require("../api/Notification");
const User_1 = require("../api/User");
const contexts = __importStar(require("../utils/notification-contexts"));
const sequelize_1 = require("sequelize");
const push_1 = require("../api/Notification/push");
class Notification {
    constructor() {
        this._notificationService = new Notification_1.NotificationService();
        /**
         * send Notification
         */
        this.sendNotification = async (message, context, createLocal, extraData, userId, targetId, isFromApp = true) => {
            if (createLocal == true) {
                await this.createLocal(userId, targetId, message, context, extraData);
            }
            const target = await User_1.UserModel.findByPk(targetId);
            if (!target || target.player_id == null || userId == targetId) {
                return null;
            }
            const user = await User_1.UserModel.findByPk(userId);
            if (!user && isFromApp == true) {
                return null;
            }
            let settings = await target.getSettings();
            if (!settings) {
                const saved = await User_1.SettingModel.create();
                if (saved && (await target.setSettings(saved))) {
                    settings = await target.getSettings();
                }
            }
            const settingsJSON = settings.toJSON();
            if (settingsJSON.hasOwnProperty(context) || isFromApp == false) {
                const settingValue = settingsJSON[context];
                const player_id = target.player_id;
                const canSendPush = (settingValue == true && player_id != null) || isFromApp == false
                    ? true
                    : false;
                if (canSendPush) {
                    const heading = context == contexts.DIRECT_MESSAGE
                        ? "New direct message"
                        : "New notification";
                    const notification = {
                        contents: {
                            en: !user ? `${message}` : `${user.username} ${message}`,
                        },
                        data: {
                            context,
                            extraData,
                        },
                        headings: {
                            en: heading,
                        },
                        include_player_ids: [target.player_id],
                        subtitle: {
                            en: "Tap to view",
                        },
                    };
                    return Notification_1.sendPush(notification);
                }
            }
        };
        this.sendPostNotification = async (message, context, extraData, user, per_page = 2000) => {
            // let per_page: number = 2000;
            let playerReslt = await this.getPlayerIds(user, per_page);
            let totalDbCount = playerReslt.totalDbCount;
            if (playerReslt.canSendPush && playerReslt.player_ids.length > 0) {
                const heading = context == contexts.NEW_POST ? "New post created" : "New notification";
                const notification = {
                    contents: {
                        en: !user ? `${message}` : `${user.username} ${message}`,
                    },
                    include_player_ids: playerReslt.player_ids,
                    data: {
                        context,
                        extraData,
                    },
                    headings: {
                        en: heading,
                    },
                    // include_player_ids: player_ids,
                    // included_segments: ["Active Users"],
                    subtitle: {
                        en: "Tap to view",
                    },
                };
                per_page += playerReslt.player_ids.length;
                push_1.sendPostPush(notification);
                if (per_page < totalDbCount) {
                    this.sendPostNotification(message, context, extraData, user, per_page);
                }
                return {
                    status: true,
                    data: extraData,
                };
            }
            return {
                status: true,
                data: extraData,
            };
        };
        this.getPlayerIds = async (user, per_page) => {
            let all_id = [];
            const limit = 2000;
            const offset = per_page - limit;
            let totalDbCount;
            let target_id = await User_1.SettingModel.findAll({
                limit,
                offset,
                attributes: {
                    include: ["settingId"],
                },
                where: {
                    [sequelize_1.Op.and]: [
                        {
                            settingId: {
                                [sequelize_1.Op.ne]: user.id,
                            },
                        },
                        {
                            post: 1,
                        },
                    ],
                },
            });
            totalDbCount = await User_1.SettingModel.count({
                where: {
                    [sequelize_1.Op.and]: [
                        {
                            settingId: {
                                [sequelize_1.Op.ne]: user.id,
                            },
                        },
                        {
                            post: 1,
                        },
                    ],
                },
            });
            if (target_id) {
                target_id.forEach((element) => {
                    all_id.push(element.settingId);
                });
                const target = await User_1.UserModel.findAll({
                    attributes: ["player_id"],
                    where: {
                        [sequelize_1.Op.and]: [
                            {
                                id: all_id,
                            },
                            {
                                player_id: {
                                    [sequelize_1.Op.ne]: null,
                                },
                            },
                        ],
                    },
                });
                if (!target) {
                    return null;
                }
                let player_ids = [];
                target.forEach((element) => {
                    player_ids.push(element.player_id);
                });
                const canSendPush = target ? true : false;
                return { player_ids, canSendPush, totalDbCount };
            }
        };
        /**
         * create
         */
        // tslint:disable-next-line:max-line-length
        this.createLocal = async (user, resourceOwner, message, context, extraData) => {
            if (user == resourceOwner) {
                return null;
            }
            const notification = {
                message,
                context,
                triggered_by: user,
                extra_data: JSON.stringify(extraData),
            };
            const saved = await this._notificationService.createNotification(resourceOwner, notification);
            if (!saved) {
                return null;
            }
            return true;
        };
    }
}
exports.Notification = Notification;
//# sourceMappingURL=notification.js.map