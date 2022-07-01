"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateModel = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const sequelize_2 = require("sequelize");
const database_1 = require("../../shared/database");
const logger_1 = require("../../utils/logger");
const config_1 = require("../../config");
class StateModel extends sequelize_2.Model {
}
exports.StateModel = StateModel;
StateModel.init({
    name: {
        type: sequelize_1.default.STRING(50),
    },
}, {
    sequelize: database_1.DB,
    modelName: "states",
});
const option = {
    alter: config_1.ALTER_STATE,
};
// force: true will drop the table if it already exists
StateModel.sync(option).then(() => {
    logger_1.logger.info("States table migrated");
    // Table created
});
//# sourceMappingURL=stateModel.js.map