import Sequelize, { Model } from "sequelize";
import { DB } from "../../shared/database";
import { logger } from "../../utils/logger";
import withCursor from "sequelize-cursor-pagination";
import { ALTER_STATE } from "../../config";

export class VehicleModel extends Model {}

VehicleModel.init(
  {
    name: {
      type: Sequelize.STRING(),
      validate: {
        notEmpty: { msg: "name can't be empty" },
      },
    },
    plate_number: {
      type: Sequelize.STRING(9),
      validate: {
        notEmpty: { msg: "plate number can't be empty" },
      },
    },
    color: {
      type: Sequelize.STRING(50),
    },
    fuel_type: {
      type: Sequelize.ENUM({ values: ["petrol", "diesel"] }),
    },
    vehicle_type: {
      type: Sequelize.ENUM({
        values: ["bus", "motorcycle", "tricycle", "car"],
      }),
    },
    category: {
      type: Sequelize.ENUM({ values: ["commercial", "government", "private"] }),
    },
    chassis_no: {
      type: Sequelize.STRING(150),
      unique: {
        name: "chassis_no",
        msg: "An account already exists with this chassis number",
      },
    },
    engine_capacity: {
      type: Sequelize.ENUM({
        values: [
          "above 3.0",
          "below 1.6",
          "between 1.6 and 2.0",
          "between 2.1 and 3.0",
        ],
      }),
    },
    tank_capacity: {
      type: Sequelize.STRING(150),
    },
    driver_license_no: {
      type: Sequelize.STRING(150),
    },
    license_bearer_name: {
      type: Sequelize.STRING(150),
    },
    state_of_plateNo_allocation: {
      type: Sequelize.STRING(),
    },
    status: {
      defaultValue: "authorized",
      type: Sequelize.ENUM({ values: ["authorized", "unauthorized"] }),
    },
  },
  {
    sequelize: DB,
    modelName: "vehicles",
  }
);

const options: any = { alter: ALTER_STATE };

const paginationOptions: any = {
  methodName: "paginate",
  primaryKeyField: "id",
};
// force: true will drop the table if it already exists
VehicleModel.sync(options).then(() => {
  logger.info("Vehicles table migrated");
  // Table created
});
withCursor(paginationOptions)(<any>VehicleModel);
