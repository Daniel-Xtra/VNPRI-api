"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleController = void 0;
const baseController_1 = require("../baseController");
const vehicleService_1 = require("./vehicleService");
class VehicleController extends baseController_1.BaseController {
    constructor() {
        super(...arguments);
        this._vehicleService = new vehicleService_1.VehicleService();
        this.index = () => {
            return this.sendResponse("hello!");
        };
        this.getVehicle = async (plate_number) => {
            const plate = await this._vehicleService.getVehicle(plate_number);
            return this.sendResponse(plate);
        };
        this.regVehicle = async (data) => {
            const create = await this._vehicleService.regVehicle(data);
            return this.sendResponse(create);
        };
        this.delVehicle = async (plate_number) => {
            const del = await this._vehicleService.delVehicle(plate_number);
            return this.sendResponse(del);
        };
        this.getOwner = async (email) => {
            const person = await this._vehicleService.getOwner(email);
            return this.sendResponse(person);
        };
    }
}
exports.VehicleController = VehicleController;
//# sourceMappingURL=vehicleController.js.map