"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const http_1 = require("http");
const config_1 = require("./config");
const logger_1 = require("./utils/logger");
// import * as fs from "fs";
// const httpsOptions = {
//     key: fs.readFileSync("api_mypaddiapp_com.key"),
//     cert: fs.readFileSync("api_mypaddiapp_com.crt"),
//     ca: fs.readFileSync("api_mypaddiapp_com.ca-bundle"),
// };
const port = config_1.PORT || 5000;
const httpServer = new http_1.Server(app_1.default);
// app.use((req, res, next) => {
//     console.log(req.headers, "what is it?", req.protocol, req.url);
//     if (req.protocol === "http") {
//         res.redirect(301, `https://${req.headers.host}${req.url}`);
//     }
//     next();
// });
httpServer.listen(config_1.PORT, (err) => {
    if (err) {
        return logger_1.logger.error(err);
    }
    return logger_1.logger.info(`http Server is listening on port: ${port}`);
});
// new SocketController(httpServer).startSocket();
// new SocketController(server).startSocket();
//# sourceMappingURL=index.js.map