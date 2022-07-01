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
exports.ProfileModel = void 0;
const sequelize_1 = __importStar(require("sequelize"));
const database_1 = require("../../shared/database");
const logger_1 = require("../../utils/logger");
const config_1 = require("../../config");
const User_1 = require("../User");
class ProfileModel extends sequelize_1.Model {
}
exports.ProfileModel = ProfileModel;
ProfileModel.init({
    profile_picture_url: {
        type: sequelize_1.default.STRING(120),
    },
    relationship_status: {
        type: sequelize_1.default.STRING(120),
    },
    occupation: {
        type: sequelize_1.default.STRING(120),
    },
    highest_education: {
        type: sequelize_1.default.STRING(120),
    },
    current_education: {
        type: sequelize_1.default.STRING(120),
    },
    bio: {
        type: sequelize_1.default.STRING(120),
    },
    location: {
        type: sequelize_1.default.STRING(120),
    },
    facebook_url: {
        type: sequelize_1.default.STRING(120),
    },
    twitter_url: {
        type: sequelize_1.default.STRING(120),
    },
    instagram_url: {
        type: sequelize_1.default.STRING(120),
    },
    snapchat_id: {
        type: sequelize_1.default.STRING(120),
    },
}, {
    sequelize: database_1.DB,
    modelName: "profiles",
});
const options = {
    alter: config_1.ALTER_STATE,
};
User_1.UserModel.hasOne(ProfileModel);
ProfileModel.belongsTo(User_1.UserModel);
// force: true will drop the table if it already exists
ProfileModel.sync(options).then(() => {
    logger_1.logger.info("Profiles table migrated");
    // Table created
});
//# sourceMappingURL=profileModel.js.map