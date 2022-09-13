import Sequelize from "sequelize";
import { Model } from "sequelize";
import { DB } from "../../shared/database";
import { logger } from "../../utils/logger";
import { ALTER_STATE } from "../../config";
import { VehicleModel } from "../Vehicle";
import { UserModel } from "../User";

export class ReportModel extends Model {}

ReportModel.init(
  {
    reason: {
      type: Sequelize.STRING(50),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please provide a reason",
        },
      },
    },
    unique_id: {
      type: Sequelize.STRING(100),
      unique: {
        name: "unique_id",
        msg: "Duplicate unique_id",
      },
    },
    status: {
      type: Sequelize.ENUM({ values: ["resolved", "unresolved"] }),
      defaultValue: "unresolved",
    },
  },
  {
    sequelize: DB,
    modelName: "reports",
  }
);

const option: any = {
  alter: ALTER_STATE,
};

// VehicleModel.hasMany(ReportModel);
// UserModel.hasMany(ReportModel);
ReportModel.belongsTo(VehicleModel);
ReportModel.belongsTo(UserModel, { as: "reporter" });

// force: true will drop the table if it already exists
ReportModel.sync(option).then(() => {
  logger.info("Report table migrated");
  // Table created
});
