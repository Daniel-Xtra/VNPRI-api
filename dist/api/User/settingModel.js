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
exports.SettingModel = void 0;
const sequelize_1 = __importStar(require("sequelize"));
const database_1 = require("../../shared/database");
const _1 = require(".");
const logger_1 = require("../../utils/logger");
const config_1 = require("../../config");
class SettingModel extends sequelize_1.Model {
}
exports.SettingModel = SettingModel;
SettingModel.init({
    all: {
        type: sequelize_1.default.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    post: {
        type: sequelize_1.default.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    post_comment: {
        type: sequelize_1.default.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    comment_reply: {
        type: sequelize_1.default.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    comment_like: {
        type: sequelize_1.default.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    poll_reaction: {
        type: sequelize_1.default.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    follow_post_comment: {
        type: sequelize_1.default.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    received_coins: {
        type: sequelize_1.default.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    direct_message: {
        type: sequelize_1.default.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    added_to_paddilist: {
        type: sequelize_1.default.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    request_accepted: {
        type: sequelize_1.default.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    request_declined: {
        type: sequelize_1.default.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    sequelize: database_1.DB,
    modelName: "notification_settings",
});
_1.UserModel.hasOne(SettingModel, {
    as: "settings",
});
SettingModel.belongsTo(_1.UserModel);
const syncOptions = { alter: config_1.ALTER_STATE };
SettingModel.sync(syncOptions).then(() => {
    logger_1.logger.info("Notification settings table migrated");
    // Table created
});
//# sourceMappingURL=settingModel.js.map