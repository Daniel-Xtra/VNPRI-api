"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
exports.DB = new sequelize_1.Sequelize(config_1.DB_NAME, config_1.DB_USER, config_1.DB_PASSWORD, {
    host: config_1.DB_HOST,
    dialect: "mysql",
    logging: false,
    typeValidation: true,
    dialectOptions: {
        supportBigNumbers: true,
        bigNumberStrings: true,
        decimalNumbers: true,
    },
    define: {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: "deleted_at",
        paranoid: true,
        underscored: true,
    },
    pool: {
        max: 10,
        min: 0,
        acquire: 600000,
        idle: 10000,
        evict: 60000,
    },
});
//# sourceMappingURL=database.js.map