import Sequelize from "sequelize";
import { Model } from "sequelize";
import { ALTER_STATE } from "../../config";
import { DB } from "../../shared/database";
import { logger } from "../../utils/logger";
import { UserModel } from "../User/userModel";

export class NotificationModel extends Model {}
NotificationModel.init(
  {
    message: {
      type: Sequelize.STRING(150),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please provide a notification message",
        },
      },
    },
    context: {
      type: Sequelize.STRING(150),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please provide the notification context",
        },
      },
    },
    is_read: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    triggered_by: {
      type: Sequelize.INTEGER,
      references: { model: UserModel, key: "id" },
    },
    extra_data: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      references: { model: UserModel, key: "id" },
    },
  },
  {
    sequelize: DB,
    modelName: "notifications",
  }
);

NotificationModel.belongsTo(UserModel, {
  foreignKey: "user_id",
  as: "userid",
});

UserModel.hasMany(NotificationModel, {
  foreignKey: "user_id",
});

NotificationModel.belongsTo(UserModel, {
  foreignKey: "triggered_by",
  as: "user",
});

UserModel.hasMany(NotificationModel, {
  foreignKey: "triggered_by",
});


const option: any = {
  alter: ALTER_STATE,
};

// force: true will drop the table if it already exists
NotificationModel.sync(option).then(() => {
  logger.info("Notification table migrated");
  // Table created
});
