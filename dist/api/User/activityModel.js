"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityModel = void 0;
const sequelize_1 = __importStar(require("sequelize"));
const database_1 = require("../../shared/database");
const logger_1 = require("../../utils/logger");
const _1 = require(".");
const config_1 = require("../../config");
class ActivityModel extends sequelize_1.Model {
}
exports.ActivityModel = ActivityModel;
ActivityModel.init({
    average_app_session_time: {
        type: sequelize_1.default.STRING(120),
    },
    in_app_search_history: {
        type: sequelize_1.default.STRING(120),
    },
    last_login_ip: {
        type: sequelize_1.default.STRING(120),
    },
    last_device_information: {
        type: sequelize_1.default.STRING(120),
    },
    total_likes: {
        type: sequelize_1.default.STRING(120),
    },
    total_comments: {
        type: sequelize_1.default.STRING(120),
    },
    total_comment_likes: {
        type: sequelize_1.default.STRING(120),
    },
    total_post_views: {
        type: sequelize_1.default.STRING(120),
    },
    topics_authored: {
        type: sequelize_1.default.STRING(120),
    },
    reports_on_posts: {
        type: sequelize_1.default.STRING(120),
    },
    replies_to_comments: {
        type: sequelize_1.default.STRING(120),
    },
    replies_to_posts: {
        type: sequelize_1.default.STRING(120),
    },
    polls_created: {
        type: sequelize_1.default.STRING(120),
    },
    total_polls_activity: {
        type: sequelize_1.default.STRING(120),
    },
    diary_entries: {
        type: sequelize_1.default.STRING(120),
    },
    app_pages_visited: {
        type: sequelize_1.default.STRING(120),
    },
}, {
    sequelize: database_1.DB,
    modelName: "activity_logs",
});
_1.UserModel.hasOne(ActivityModel);
ActivityModel.belongsTo(_1.UserModel);
const options = { alter: config_1.ALTER_STATE };
// force: true will drop the table if it already exists
ActivityModel.sync(options).then(() => {
    logger_1.logger.info("Activity logs table migrated");
    // Table created
});
//# sourceMappingURL=activityModel.js.map