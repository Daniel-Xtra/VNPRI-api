"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportModel = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const sequelize_2 = require("sequelize");
const database_1 = require("../../shared/database");
const logger_1 = require("../../utils/logger");
const config_1 = require("../../config");
const Vehicle_1 = require("../Vehicle");
const User_1 = require("../User");
class ReportModel extends sequelize_2.Model {
}
exports.ReportModel = ReportModel;
ReportModel.init({
    reason: {
        type: sequelize_1.default.STRING(50),
        allowNull: false,
        validate: {
            notNull: {
                msg: "Please provide a reason",
            },
        },
    },
    unique_id: {
        type: sequelize_1.default.STRING(100),
        unique: {
            name: "unique_id",
            msg: "Duplicate unique_id",
        },
    },
    status: {
        type: sequelize_1.default.ENUM({ values: ["resolved", "unresolved"] }),
        defaultValue: "unresolved",
    },
}, {
    sequelize: database_1.DB,
    modelName: "reports",
});
const option = {
    alter: config_1.ALTER_STATE,
};
// VehicleModel.hasMany(ReportModel);
// UserModel.hasMany(ReportModel);
ReportModel.belongsTo(Vehicle_1.VehicleModel);
ReportModel.belongsTo(User_1.UserModel, { as: "reporter" });
// force: true will drop the table if it already exists
ReportModel.sync(option).then(() => {
    logger_1.logger.info("Report table migrated");
    // Table created
});
//# sourceMappingURL=reportModel.js.map