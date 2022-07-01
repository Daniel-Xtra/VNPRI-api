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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const sequelize_1 = __importStar(require("sequelize"));
const database_1 = require("../../shared/database");
const logger_1 = require("../../utils/logger");
const sequelize_cursor_pagination_1 = __importDefault(require("sequelize-cursor-pagination"));
const config_1 = require("../../config");
class UserModel extends sequelize_1.Model {
}
exports.UserModel = UserModel;
UserModel.init({
    username: {
        type: sequelize_1.default.STRING(50),
        unique: {
            name: "username",
            msg: "An account already exists with this username",
        },
        validate: {
            is: /^[a-zA-Z0-9._-]{3,16}$/i,
            notEmpty: {
                msg: "Username cannot be empty",
            },
        },
    },
    email: {
        type: sequelize_1.default.STRING(50),
        unique: {
            name: "email",
            msg: "An account already exists with this email address.",
        },
        validate: {
            isEmail: { msg: "Please check this is a valid email" },
            notEmpty: { msg: "email can't be empty" },
        },
    },
    phone_number: {
        type: sequelize_1.default.STRING(20),
        validate: {
            isNumeric: {
                msg: "Please confirm phonenumber contains valid characters",
            },
        },
    },
    password: {
        type: sequelize_1.default.STRING(191),
    },
    first_name: {
        type: sequelize_1.default.STRING(10),
        validate: {
            min: 2,
        },
    },
    last_name: {
        type: sequelize_1.default.STRING(50),
        validate: {
            min: 2,
        },
    },
    gender: {
        type: sequelize_1.default.ENUM({
            values: ["male", "female"],
        }),
    },
    // date_of_birth: {
    //   type: Sequelize.STRING(50),
    // },
    membership_type: {
        type: sequelize_1.default.ENUM({
            values: ["user", "admin"],
        }),
    },
    email_verification_code: {
        type: sequelize_1.default.STRING(150),
        unique: {
            name: "email_verification_code",
            msg: "Duplicate email_verification_code",
        },
    },
    password_reset_code: {
        type: sequelize_1.default.STRING(6),
        unique: {
            name: "password_reset_code",
            msg: "Duplicate password reset code",
        },
    },
    verified: {
        type: sequelize_1.default.BOOLEAN,
        defaultValue: true,
    },
    player_id: {
        type: sequelize_1.default.STRING(50),
    },
    pass_updated: {
        type: sequelize_1.default.INTEGER,
        defaultValue: 0,
    },
    refresh_token: {
        type: sequelize_1.default.STRING(150),
        unique: {
            name: "refresh_token",
            msg: "Duplicate refresh token",
        },
        allowNull: true,
    },
    auth_key: {
        type: sequelize_1.default.TEXT,
    },
    username_updated: {
        type: sequelize_1.default.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize: database_1.DB,
    modelName: "users",
});
const options = { alter: config_1.ALTER_STATE };
const paginationOptions = {
    methodName: "paginate",
    primaryKeyField: "id",
};
// force: true will drop the table if it already exists
UserModel.sync(options).then(() => {
    logger_1.logger.info("Users table migrated");
    // Table created
});
sequelize_cursor_pagination_1.default(paginationOptions)(UserModel);
//# sourceMappingURL=userModel.js.map