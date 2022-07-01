import Sequelize from "sequelize";
import { Model } from "sequelize";
import { DB } from "../../shared/database";
import { logger } from "../../utils/logger";
import { ALTER_STATE } from "../../config";
import { VehicleModel } from "./vehicleModel";

export class OwnerModel extends Model {}

OwnerModel.init(
  {
    owner_identification: {
      type: Sequelize.ENUM({
        values: ["driver`s license", "national ID card", "others"],
      }),
    },
    title: {
      type: Sequelize.ENUM({ values: ["mr", "mrs", "dr", "prof", "engr"] }),
    },
    first_name: {
      type: Sequelize.STRING(10),
      validate: {
        min: 2,
      },
    },
    last_name: {
      type: Sequelize.STRING(50),
      validate: {
        min: 2,
        notEmpty: {
          msg: "Lastname cannot be empty",
        },
      },
    },
    gender: {
      type: Sequelize.ENUM({ values: ["male", "female"] }),
    },
    identification_no: {
      type: Sequelize.STRING(150),
    },
    address: {
      type: Sequelize.STRING(150),
    },
    email: {
      type: Sequelize.TEXT(),
    },
    phone_number: {
      type: Sequelize.TEXT(),
      validate: {
        isNumeric: {
          msg: "Please confirm phonenumber contains valid characters",
        },
      },
    },
  },
  {
    sequelize: DB,
    modelName: "owners",
  }
);

VehicleModel.hasOne(OwnerModel);
OwnerModel.belongsTo(VehicleModel);

const option: any = {
  alter: ALTER_STATE,
};

// force: true will drop the table if it already exists
OwnerModel.sync(option).then(() => {
  logger.info("Owners table migrated");
  // Table created
});
