import Sequelize from "sequelize";
import { Model } from "sequelize";
import { DB } from "../../shared/database";
import { logger } from "../../utils/logger";
import { ALTER_STATE } from "../../config";


export class StateModel extends Model { }

StateModel.init(
    {
        name: {
            type: Sequelize.STRING(50),
        },
    },
    {
        sequelize: DB,
        modelName: "states",
    },
);


const option: any = {
    alter: ALTER_STATE,
};

// force: true will drop the table if it already exists
StateModel.sync(option).then(() => {
    logger.info("States table migrated");
    // Table created
});
