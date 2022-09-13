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
exports.VehicleModel = void 0;
const sequelize_1 = __importStar(require("sequelize"));
const database_1 = require("../../shared/database");
const logger_1 = require("../../utils/logger");
const sequelize_cursor_pagination_1 = __importDefault(require("sequelize-cursor-pagination"));
const config_1 = require("../../config");
class VehicleModel extends sequelize_1.Model {
}
exports.VehicleModel = VehicleModel;
VehicleModel.init({
    name: {
        type: sequelize_1.default.STRING(),
        validate: {
            notEmpty: { msg: "name can't be empty" },
        },
    },
    plate_number: {
        type: sequelize_1.default.STRING(9),
        validate: {
            notEmpty: { msg: "plate number can't be empty" },
        },
    },
    color: {
        type: sequelize_1.default.STRING(50),
    },
    fuel_type: {
        type: sequelize_1.default.ENUM({ values: ["petrol", "diesel"] }),
    },
    vehicle_type: {
        type: sequelize_1.default.ENUM({
            values: ["bus", "motorcycle", "tricycle", "car"],
        }),
    },
    category: {
        type: sequelize_1.default.ENUM({ values: ["commercial", "government", "private"] }),
    },
    chassis_no: {
        type: sequelize_1.default.STRING(150),
        unique: {
            name: "chassis_no",
            msg: "An account already exists with this chassis number",
        },
    },
    engine_capacity: {
        type: sequelize_1.default.ENUM({
            values: [
                "above 3.0",
                "below 1.6",
                "between 1.6 and 2.0",
                "between 2.1 and 3.0",
            ],
        }),
    },
    tank_capacity: {
        type: sequelize_1.default.STRING(150),
    },
    driver_license_no: {
        type: sequelize_1.default.STRING(150),
    },
    license_bearer_name: {
        type: sequelize_1.default.STRING(150),
    },
    state_of_plateNo_allocation: {
        type: sequelize_1.default.STRING(),
    },
    status: {
        defaultValue: "authorized",
        type: sequelize_1.default.ENUM({ values: ["authorized", "unauthorized"] }),
    },
}, {
    sequelize: database_1.DB,
    modelName: "vehicles",
});
const options = { alter: config_1.ALTER_STATE };
const paginationOptions = {
    methodName: "paginate",
    primaryKeyField: "id",
};
// force: true will drop the table if it already exists
VehicleModel.sync(options).then(() => {
    logger_1.logger.info("Vehicles table migrated");
    // Table created
});
sequelize_cursor_pagination_1.default(paginationOptions)(VehicleModel);
//# sourceMappingURL=vehicleModel.js.map