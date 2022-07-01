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
exports.API_SECRET = exports.API_KEY = exports.CLOUD_NAME = exports.GMAIL_PASSWORD = exports.GMAIL_USERNAME = exports.ALTER_STATE = exports.JWT_SECRET_REFRESHTOKEN = exports.JWT_SECRET = exports.DB_HOST = exports.DB_PASSWORD = exports.DB_USER = exports.DB_NAME = exports.BASE_PATH = exports.APP_URL = exports.ENVIRONMENT = exports.PORT2 = exports.PORT = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.PORT = process.env.PORT;
exports.PORT2 = process.env.PORT2;
exports.ENVIRONMENT = process.env.NODE_ENV;
exports.APP_URL = process.env.APP_URL;
exports.BASE_PATH = process.env.BASE_PATH;
exports.DB_NAME = process.env.DB_NAME;
exports.DB_USER = process.env.DB_USER;
exports.DB_PASSWORD = process.env.DB_PASSWORD;
exports.DB_HOST = process.env.DB_HOST;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_SECRET_REFRESHTOKEN = process.env.JWT_SECRET_REFRESHTOKEN;
exports.ALTER_STATE = process.env.ALTER_STATE;
exports.GMAIL_USERNAME = process.env.GMAIL_USERNAME;
exports.GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;
exports.CLOUD_NAME = process.env.CLOUD_NAME;
exports.API_KEY = process.env.API_KEY;
exports.API_SECRET = process.env.API_SECRET;
//# sourceMappingURL=index.js.map