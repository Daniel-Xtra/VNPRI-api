import Sequelize, { Model } from "sequelize";
import { DB } from "../../shared/database";
import { UserModel } from "../User";
import { ALTER_STATE } from "../../config";
import { logger } from "../../utils/logger";

export class SessionHistoryModel extends Model { }
SessionHistoryModel.init(
  {
    // session_state: {
    //   type: Sequelize.ENUM({ values: ['inactive', 'active'] }),
    //   defaultValue: 'active',
    // },
    with_user: {
      type: Sequelize.INTEGER,
      references: {
        model: UserModel,
        key: "id",
      },
    },
  },
  {
    sequelize: DB,
    modelName: "chat_session_history",
  },
);

UserModel.hasMany(SessionHistoryModel, {
  as: {
    singular: "sessionHistory",
    plural: "sessionHistories",
  },
});
SessionHistoryModel.belongsTo(UserModel);

const syncOption: any = {
  alter: ALTER_STATE,
};
// force: true will drop the table if it already exists
SessionHistoryModel.sync(syncOption).then(() => {
  logger.info("Session history table migrated");
  // Table created
});

