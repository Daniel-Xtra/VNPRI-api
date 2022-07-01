import Sequelize, { Model } from "sequelize";
import { DB } from "../../shared/database";
import { logger } from "../../utils/logger";
import { ALTER_STATE } from "../../config";
import { UserModel } from "./userModel";

export class AccountModel extends Model { }
AccountModel.init(
    {
        online_time: {
            type: Sequelize.DATE,
        },
        offline_time: {
            type: Sequelize.DATE,
        },
        hour_used: {
            type: Sequelize.STRING(120),
        },
        account_status: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        sequelize: DB,
        modelName: "doctor_accounts",
    },
);

const options: any = {
    alter: ALTER_STATE,
};

UserModel.hasMany(AccountModel, {
    as: "accounts",
});
AccountModel.belongsTo(UserModel);

// force: true will drop the table if it already exists
AccountModel.sync(options).then(() => {
    logger.info("Doctor's account table migrated");
    // Table created
});
