"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModel = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const sequelize_2 = require("sequelize");
const config_1 = require("../../config");
const database_1 = require("../../shared/database");
const logger_1 = require("../../utils/logger");
const userModel_1 = require("../User/userModel");
class NotificationModel extends sequelize_2.Model {
}
exports.NotificationModel = NotificationModel;
NotificationModel.init({
    message: {
        type: sequelize_1.default.STRING(150),
        allowNull: false,
        validate: {
            notNull: {
                msg: "Please provide a notification message",
            },
        },
    },
    context: {
        type: sequelize_1.default.STRING(150),
        allowNull: false,
        validate: {
            notNull: {
                msg: "Please provide the notification context",
            },
        },
    },
    is_read: {
        type: sequelize_1.default.BOOLEAN,
        defaultValue: false,
    },
    triggered_by: {
        type: sequelize_1.default.INTEGER,
        references: { model: userModel_1.UserModel, key: "id" },
    },
    extra_data: {
        type: sequelize_1.default.TEXT,
        allowNull: true,
    },
    user_id: {
        type: sequelize_1.default.INTEGER,
        references: { model: userModel_1.UserModel, key: "id" },
    },
}, {
    sequelize: database_1.DB,
    modelName: "notifications",
});
NotificationModel.belongsTo(userModel_1.UserModel, {
    foreignKey: "user_id",
    as: "userid",
});
userModel_1.UserModel.hasMany(NotificationModel, {
    foreignKey: "user_id",
});
NotificationModel.belongsTo(userModel_1.UserModel, {
    foreignKey: "triggered_by",
    as: "user",
});
userModel_1.UserModel.hasMany(NotificationModel, {
    foreignKey: "triggered_by",
});
const option = {
    alter: config_1.ALTER_STATE,
};
// force: true will drop the table if it already exists
NotificationModel.sync(option).then(() => {
    logger_1.logger.info("Notification table migrated");
    // Table created
});
//# sourceMappingURL=notificationModel.js.map