"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleService = void 0;
const sequelize_1 = require("sequelize");
const app_error_1 = require("../../utils/app-error");
const ownerModel_1 = require("./ownerModel");
const vehicleModel_1 = require("./vehicleModel");
class VehicleService {
    constructor() {
        this.getVehicle = async (plate_number) => {
            let plate = await vehicleModel_1.VehicleModel.findAll({
                where: { plate_number },
            });
            if (plate) {
                plate = await Promise.all(plate.map(async (own) => {
                    own = own.toJSON();
                    own.owner = await ownerModel_1.OwnerModel.findOne({
                        where: { vehicle_id: own.id },
                    });
                    return own;
                }));
                return plate;
            }
            throw new app_error_1.AppError(`Vehicle with plate number ${plate_number} not found`, null, 404);
        };
        this.regVehicle = async (data) => {
            const checkDuplicateOrNot = await vehicleModel_1.VehicleModel.findOne({
                where: {
                    [sequelize_1.Op.or]: [
                        {
                            plate_number: data.plate_number,
                        },
                        { chassis_no: data.chassis_no },
                    ],
                },
            });
            if (checkDuplicateOrNot) {
                if (checkDuplicateOrNot.chassis_no == data.chassis_no) {
                    throw new app_error_1.AppError(`Sorry, that chassis number is already in use`);
                }
                else if (checkDuplicateOrNot.plate_number == data.plate_number) {
                    throw new app_error_1.AppError(`Plate number is already in use`);
                }
            }
            if (!checkDuplicateOrNot) {
                const create = await vehicleModel_1.VehicleModel.create(data);
                const owner = await ownerModel_1.OwnerModel.create(data);
                await create.setOwner(owner);
                return data;
            }
        };
        this.delVehicle = async (plate_number) => {
            const search = await vehicleModel_1.VehicleModel.findOne({ where: { plate_number } });
            if (!search) {
                throw new app_error_1.AppError("Cannot perform that action.", null, 400);
            }
            const deleted = await vehicleModel_1.VehicleModel.destroy({
                where: { plate_number },
                force: true,
            });
            if (!deleted) {
                throw new app_error_1.AppError("Could not delete question", null, 400);
            }
        };
        this.getOwner = async (email) => {
            let owner = await ownerModel_1.OwnerModel.findAll({ where: { email } });
            if (owner) {
                owner = await Promise.all(owner.map(async (car) => {
                    car = car.toJSON();
                    car.vechicles = await vehicleModel_1.VehicleModel.findAll({
                        where: { id: car.vehicleId },
                    });
                    return car;
                }));
                return owner;
            }
            throw new app_error_1.AppError(`Sorry, owner with ${email} not found`, null, 404);
        };
    }
}
exports.VehicleService = VehicleService;
//# sourceMappingURL=vehicleService.js.map