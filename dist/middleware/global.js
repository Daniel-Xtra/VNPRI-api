"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const path_1 = __importDefault(require("path"));
const cors = require("cors");
const express = require("express");
const morgan_1 = __importDefault(require("morgan"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = require("./passport");
exports.default = (app) => {
    app.use(cors({ maxAge: 1728000 }));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use("/photo", express.static(path_1.default.join("public/categories")));
    app.use(morgan_1.default("dev"));
    passport_1.default.use(passport_2.jwtStrategy);
};
//# sourceMappingURL=global.js.map