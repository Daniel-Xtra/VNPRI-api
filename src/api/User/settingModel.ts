import sequelize, { Model } from "sequelize";
import { DB } from "../../shared/database";
import { UserModel } from ".";
import { logger } from "../../utils/logger";
import { ALTER_STATE } from "../../config";

export class SettingModel extends Model {}

SettingModel.init(
  {
    all: {
      type: sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    post: {
      type: sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    post_comment: {
      type: sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    comment_reply: {
      type: sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    comment_like: {
      type: sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    poll_reaction: {
      type: sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    follow_post_comment: {
      type: sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    received_coins: {
      type: sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    direct_message: {
      type: sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    added_to_paddilist: {
      type: sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    request_accepted: {
      type: sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    request_declined: {
      type: sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize: DB,
    modelName: "notification_settings",
  }
);

UserModel.hasOne(SettingModel, {
  as: "settings",
});
SettingModel.belongsTo(UserModel);

const syncOptions: any = { alter: ALTER_STATE };

SettingModel.sync(syncOptions).then(() => {
  logger.info("Notification settings table migrated");
  // Table created
});
