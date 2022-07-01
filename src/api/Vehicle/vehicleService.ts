import { Op } from "sequelize";
import { AppError } from "../../utils/app-error";
import { IVehicle } from "./IVehicle";
import { OwnerModel } from "./ownerModel";
import { VehicleModel } from "./vehicleModel";

export class VehicleService {
  public getVehicle = async (plate_number: string) => {
    let plate = await VehicleModel.findAll({
      where: { plate_number },
    });
    if (plate) {
      plate = await Promise.all(
        plate.map(async (own) => {
          own = own.toJSON();
          own.owner = await OwnerModel.findOne({
            where: { vehicle_id: own.id },
          });
          return own;
        })
      );
      return plate;
    }
    throw new AppError(
      `Vehicle with plate number ${plate_number} not found`,
      null,
      404
    );
  };

  public regVehicle = async (data: IVehicle) => {
    const checkDuplicateOrNot = await VehicleModel.findOne({
      where: {
        [Op.or]: [
          {
            plate_number: data.plate_number,
          },
          { chassis_no: data.chassis_no },
        ],
      },
    });
    if (checkDuplicateOrNot) {
      if (checkDuplicateOrNot.chassis_no == data.chassis_no) {
        throw new AppError(`Sorry, that chassis number is already in use`);
      } else if (checkDuplicateOrNot.plate_number == data.plate_number) {
        throw new AppError(`Plate number is already in use`);
      }
    }
    if (!checkDuplicateOrNot) {
      const create = await VehicleModel.create(data);
      const owner = await OwnerModel.create(data);
      await create.setOwner(owner);
      return data;
    }
  };

  public delVehicle = async (plate_number: string) => {
    const search = await VehicleModel.findOne({ where: { plate_number } });
    if (!search) {
      throw new AppError("Cannot perform that action.", null, 400);
    }

    const deleted = await VehicleModel.destroy({
      where: { plate_number },
      force: true,
    });
    if (!deleted) {
      throw new AppError("Could not delete question", null, 400);
    }
  };

  public getOwner = async (email: string) => {
    let owner = await OwnerModel.findAll({ where: { email } });
    if (owner) {
      owner = await Promise.all(
        owner.map(async (car) => {
          car = car.toJSON();
          car.vechicles = await VehicleModel.findAll({
            where: { id: car.vehicleId },
          });
          return car;
        })
      );
      return owner;
    }
    throw new AppError(`Sorry, owner with ${email} not found`, null, 404);
  };
}
