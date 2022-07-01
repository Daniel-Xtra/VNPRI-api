"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.VehicleValidationSchema = joi_1.default.object().keys({
    name: joi_1.default.string().required(),
    plate_number: joi_1.default.string().required().uppercase(),
    color: joi_1.default.string().required(),
    fuel_type: joi_1.default.string().required(),
    vehicle_type: joi_1.default.string().required(),
    chassis_no: joi_1.default.string().required(),
    engine_capacity: joi_1.default.string().required(),
    tank_capacity: joi_1.default.string().required(),
    category: joi_1.default.string().required(),
    owner_identification: joi_1.default.string().required(),
    identification_no: joi_1.default.string().required(),
    driver_license_no: joi_1.default.string().required(),
    license_bearer_name: joi_1.default.string().required(),
    state_of_plateNo_allocation: joi_1.default.string().required(),
    first_name: joi_1.default.string().max(30).required(),
    last_name: joi_1.default.string().max(30).required(),
    email: joi_1.default.string().email({ minDomainAtoms: 2 }).required(),
    phone_number: joi_1.default.string()
        .regex(/^[0-9+]{11}$/)
        .required(),
    gender: joi_1.default.string().required(),
    title: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
});
//# sourceMappingURL=vehicleValidation.js.map