"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerModel = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const sequelize_2 = require("sequelize");
const database_1 = require("../../shared/database");
const logger_1 = require("../../utils/logger");
const config_1 = require("../../config");
const vehicleModel_1 = require("./vehicleModel");
class OwnerModel extends sequelize_2.Model {
}
exports.OwnerModel = OwnerModel;
OwnerModel.init({
    owner_identification: {
        type: sequelize_1.default.ENUM({
            values: ["driver`s license", "national ID card", "others"],
        }),
    },
    title: {
        type: sequelize_1.default.ENUM({ values: ["mr", "mrs", "dr", "prof", "engr"] }),
    },
    first_name: {
        type: sequelize_1.default.STRING(10),
        validate: {
            min: 2,
        },
    },
    last_name: {
        type: sequelize_1.default.STRING(50),
        validate: {
            min: 2,
            notEmpty: {
                msg: "Lastname cannot be empty",
            },
        },
    },
    gender: {
        type: sequelize_1.default.ENUM({ values: ["male", "female"] }),
    },
    identification_no: {
        type: sequelize_1.default.STRING(150),
    },
    address: {
        type: sequelize_1.default.STRING(150),
    },
    email: {
        type: sequelize_1.default.TEXT(),
    },
    phone_number: {
        type: sequelize_1.default.TEXT(),
        validate: {
            isNumeric: {
                msg: "Please confirm phonenumber contains valid characters",
            },
        },
    },
}, {
    sequelize: database_1.DB,
    modelName: "owners",
});
vehicleModel_1.VehicleModel.hasOne(OwnerModel);
OwnerModel.belongsTo(vehicleModel_1.VehicleModel);
const option = {
    alter: config_1.ALTER_STATE,
};
// force: true will drop the table if it already exists
OwnerModel.sync(option).then(() => {
    logger_1.logger.info("Owners table migrated");
    // Table created
});
//# sourceMappingURL=ownerModel.js.map