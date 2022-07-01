import Sequelize, { Model } from 'sequelize';
import { DB } from '../../shared/database';
import { logger } from '../../utils/logger';
import { UserModel } from '../User';
import { ALTER_STATE } from '../../config';
import withCursor from 'sequelize-cursor-pagination';

export class SessionModel extends Model { }
SessionModel.init(
  {
    session_state: {
      type: Sequelize.ENUM({ values: ['inactive', 'active'] }),
      defaultValue: 'active',
    },
    with_user: {
      type: Sequelize.INTEGER,
      references: {
        model: UserModel,
        key: 'id',
      },
    },
  },
  {
    sequelize: DB,
    modelName: 'chat_sessions',
  }
);

UserModel.hasMany(SessionModel, {
  as: {
    singular: 'session',
    plural: 'sessions',
  },
});
SessionModel.belongsTo(UserModel);

const paginationOptions: any = {
  methodName: 'paginate',
  primaryKeyField: 'id',
};

const syncOption: any = {
  alter: ALTER_STATE,
};
// force: true will drop the table if it already exists
SessionModel.sync(syncOption).then(() => {
  logger.info("Session table migrated");
  // Table created
});

withCursor(paginationOptions)(<any>SessionModel);
