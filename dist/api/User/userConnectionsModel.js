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
exports.UserConnectionsModel = void 0;
const sequelize_1 = __importStar(require("sequelize"));
const database_1 = require("../../shared/database");
const logger_1 = require("../../utils/logger");
const sequelize_cursor_pagination_1 = __importDefault(require("sequelize-cursor-pagination"));
const config_1 = require("../../config");
const User_1 = require("../User");
class UserConnectionsModel extends sequelize_1.Model {
}
exports.UserConnectionsModel = UserConnectionsModel;
UserConnectionsModel.init({
    user_id: {
        type: sequelize_1.default.INTEGER,
        references: {
            model: User_1.UserModel,
            key: "id",
        },
    },
    socket_id: {
        type: sequelize_1.default.STRING(50),
        // unique: {
        //   name: "socket_id",
        //   msg: "Duplicate socket_id found",
        // },
    },
}, {
    sequelize: database_1.DB,
    modelName: "user_connections",
    //  indexes: [{ unique: true, fields: ["socket_id"] }],
});
const syncOption = {
    alter: config_1.ALTER_STATE,
};
const paginationOptions = {
    methodName: "paginate",
    primaryKeyField: "id",
};
User_1.UserModel.hasMany(UserConnectionsModel);
UserConnectionsModel.belongsTo(User_1.UserModel);
// force: true will drop the table if it already exists
UserConnectionsModel.sync(syncOption).then(() => {
    logger_1.logger.info("User connections table migrated");
    // Table created
});
sequelize_cursor_pagination_1.default(paginationOptions)(UserConnectionsModel);
//# sourceMappingURL=userConnectionsModel.js.map