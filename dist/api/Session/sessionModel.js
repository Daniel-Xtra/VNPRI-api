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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionModel = void 0;
const sequelize_1 = __importStar(require("sequelize"));
const database_1 = require("../../shared/database");
const logger_1 = require("../../utils/logger");
const User_1 = require("../User");
const config_1 = require("../../config");
const sequelize_cursor_pagination_1 = __importDefault(require("sequelize-cursor-pagination"));
class SessionModel extends sequelize_1.Model {
}
exports.SessionModel = SessionModel;
SessionModel.init({
    session_state: {
        type: sequelize_1.default.ENUM({ values: ['inactive', 'active'] }),
        defaultValue: 'active',
    },
    with_user: {
        type: sequelize_1.default.INTEGER,
        references: {
            model: User_1.UserModel,
            key: 'id',
        },
    },
}, {
    sequelize: database_1.DB,
    modelName: 'chat_sessions',
});
User_1.UserModel.hasMany(SessionModel, {
    as: {
        singular: 'session',
        plural: 'sessions',
    },
});
SessionModel.belongsTo(User_1.UserModel);
const paginationOptions = {
    methodName: 'paginate',
    primaryKeyField: 'id',
};
const syncOption = {
    alter: config_1.ALTER_STATE,
};
// force: true will drop the table if it already exists
SessionModel.sync(syncOption).then(() => {
    logger_1.logger.info("Session table migrated");
    // Table created
});
sequelize_cursor_pagination_1.default(paginationOptions)(SessionModel);
//# sourceMappingURL=sessionModel.js.map