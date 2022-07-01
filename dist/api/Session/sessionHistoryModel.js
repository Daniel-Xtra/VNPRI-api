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
exports.SessionHistoryModel = void 0;
const sequelize_1 = __importStar(require("sequelize"));
const database_1 = require("../../shared/database");
const User_1 = require("../User");
const config_1 = require("../../config");
const logger_1 = require("../../utils/logger");
class SessionHistoryModel extends sequelize_1.Model {
}
exports.SessionHistoryModel = SessionHistoryModel;
SessionHistoryModel.init({
    // session_state: {
    //   type: Sequelize.ENUM({ values: ['inactive', 'active'] }),
    //   defaultValue: 'active',
    // },
    with_user: {
        type: sequelize_1.default.INTEGER,
        references: {
            model: User_1.UserModel,
            key: "id",
        },
    },
}, {
    sequelize: database_1.DB,
    modelName: "chat_session_history",
});
User_1.UserModel.hasMany(SessionHistoryModel, {
    as: {
        singular: "sessionHistory",
        plural: "sessionHistories",
    },
});
SessionHistoryModel.belongsTo(User_1.UserModel);
const syncOption = {
    alter: config_1.ALTER_STATE,
};
// force: true will drop the table if it already exists
SessionHistoryModel.sync(syncOption).then(() => {
    logger_1.logger.info("Session history table migrated");
    // Table created
});
//# sourceMappingURL=sessionHistoryModel.js.map