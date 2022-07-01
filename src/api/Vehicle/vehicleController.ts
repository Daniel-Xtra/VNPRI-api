import { BaseController } from "../baseController";
import { IVehicle } from "./IVehicle";
import { VehicleService } from "./vehicleService";

export class VehicleController extends BaseController {
  private _vehicleService = new VehicleService();

  public index = () => {
    return this.sendResponse("hello!");
  };

  public getVehicle = async (plate_number: string) => {
    const plate = await this._vehicleService.getVehicle(plate_number);
    return this.sendResponse(plate);
  };

  public regVehicle = async (data: IVehicle) => {
    const create = await this._vehicleService.regVehicle(data);
    return this.sendResponse(create);
  };

  public delVehicle = async (plate_number: string) => {
    const del = await this._vehicleService.delVehicle(plate_number);
    return this.sendResponse(del);
  };

  public getOwner = async (email: string) => {
    const person = await this._vehicleService.getOwner(email);
    return this.sendResponse(person);
  };
}
