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
exports.AccountModel = void 0;
const sequelize_1 = __importStar(require("sequelize"));
const database_1 = require("../../shared/database");
const logger_1 = require("../../utils/logger");
const config_1 = require("../../config");
const userModel_1 = require("./userModel");
class AccountModel extends sequelize_1.Model {
}
exports.AccountModel = AccountModel;
AccountModel.init({
    online_time: {
        type: sequelize_1.default.DATE,
    },
    offline_time: {
        type: sequelize_1.default.DATE,
    },
    hour_used: {
        type: sequelize_1.default.STRING(120),
    },
    account_status: {
        type: sequelize_1.default.BOOLEAN,
        defaultValue: true,
    },
}, {
    sequelize: database_1.DB,
    modelName: "doctor_accounts",
});
const options = {
    alter: config_1.ALTER_STATE,
};
userModel_1.UserModel.hasMany(AccountModel, {
    as: "accounts",
});
AccountModel.belongsTo(userModel_1.UserModel);
// force: true will drop the table if it already exists
AccountModel.sync(options).then(() => {
    logger_1.logger.info("Doctor's account table migrated");
    // Table created
});
//# sourceMappingURL=accountModel.js.map