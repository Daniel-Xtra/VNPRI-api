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
const express_1 = __importDefault(require("express"));
const Auth_1 = require("./api/Auth");
const User_1 = require("./api/User");
const config_1 = require("./config");
const middleware_1 = require("./middleware");
const database_1 = require("./shared/database");
const logger_1 = require("./utils/logger");
const Sentry = __importStar(require("@sentry/node"));
const adminRouter_1 = require("./api/Admin/adminRouter");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerDocument = __importStar(require("./swagger/swagger.json"));
const Profile_1 = require("./api/Profile");
const Vehicle_1 = require("./api/Vehicle");
const Twilio_1 = require("./api/Twilio");
const Report_1 = require("./api/Report");
class App {
    constructor() {
        this.express = express_1.default();
        this.basePath = config_1.BASE_PATH || "";
        this.boot();
    }
    boot() {
        this.initilizeDb();
        this.registerMiddlewares();
        // this.sentryErrorReporting();
        this.mountRoutes();
        this.handleUncaughtErrorEvents();
    }
    mountRoutes() {
        this.express.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
        this.express.use(`${this.basePath}/auth`, Auth_1.AuthRouter);
        this.express.use(`${this.basePath}/users`, User_1.UserRouter);
        this.express.use(`${this.basePath}/reports`, Report_1.ReportRouter);
        this.express.use(`${this.basePath}/profiles`, Profile_1.ProfileRouter);
        this.express.use(`${this.basePath}/admin`, adminRouter_1.AdminRouter);
        this.express.use(`${this.basePath}/vehicles`, Vehicle_1.VehicleRouter);
        this.express.use(`${this.basePath}/twilio`, Twilio_1.TwilioRouter);
    }
    registerMiddlewares() {
        middleware_1.global(this.express);
    }
    initilizeDb() {
        database_1.DB.authenticate()
            .then(() => {
            logger_1.logger.info("Database connection has been established successfully.");
        })
            .catch((err) => {
            throw err;
        });
    }
    // Error handlers
    handleUncaughtErrorEvents() {
        this.express.use(Sentry.Handlers.errorHandler());
        process.on("unhandledRejection", (reason, promise) => {
            throw reason;
        });
        process.on("uncaughtException", (error) => {
            logger_1.logger.error(`Uncaught Exception: ${500} - ${error.message}, Stack: ${error.stack}`);
            database_1.DB.close();
            process.exit(1);
        });
        process.on("SIGINT", () => {
            logger_1.logger.info(" Alright! Bye bye!");
            database_1.DB.close();
            process.exit();
        });
        this.express.use(middleware_1.errorHandler);
    }
}
exports.default = new App().express;
//# sourceMappingURL=app.js.map