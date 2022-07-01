import Sequelize, { Model } from "sequelize";
import { DB } from "../../shared/database";
import { logger } from "../../utils/logger";
import { UserModel } from ".";
import { ALTER_STATE } from "../../config";

export class ActivityModel extends Model { }
ActivityModel.init(
    {
        average_app_session_time: {
            type: Sequelize.STRING(120),
        },
        in_app_search_history: {
            type: Sequelize.STRING(120),
        },
        last_login_ip: {
            type: Sequelize.STRING(120),
        },
        last_device_information: {
            type: Sequelize.STRING(120),
        },
        total_likes: {
            type: Sequelize.STRING(120),
        },
        total_comments: {
            type: Sequelize.STRING(120),
        },
        total_comment_likes: {
            type: Sequelize.STRING(120),
        },
        total_post_views: {
            type: Sequelize.STRING(120),
        },
        topics_authored: {
            type: Sequelize.STRING(120),
        },
        reports_on_posts: {
            type: Sequelize.STRING(120),
        },
        replies_to_comments: {
            type: Sequelize.STRING(120),
        },
        replies_to_posts: {
            type: Sequelize.STRING(120),
        },
        polls_created: {
            type: Sequelize.STRING(120),
        },
        total_polls_activity: {
            type: Sequelize.STRING(120),
        },
        diary_entries: {
            type: Sequelize.STRING(120),
        },
        app_pages_visited: {
            type: Sequelize.STRING(120),
        },
    }, {
        sequelize: DB,
        modelName: "activity_logs",
    },
);

UserModel.hasOne(ActivityModel);
ActivityModel.belongsTo(UserModel);

const options: any = {  alter: ALTER_STATE };

// force: true will drop the table if it already exists
ActivityModel.sync(options).then(() => {
    logger.info("Activity logs table migrated");
    // Table created
});
