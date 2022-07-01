"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPostPush = exports.sendPush = void 0;
const onesignal_node_1 = __importDefault(require("onesignal-node"));
const app_error_1 = require("../../utils/app-error");
const logger_1 = require("../../utils/logger");
const joi_1 = require("joi");
// import {
//   ENVIRONMENT,
//   ONESIGNAL_LIVE_APPID,
//   ONESIGNAL_LIVE_AUTHKEY,
//   ONESIGNAL_TEST_APPID,
//   ONESIGNAL_TEST_AUTHKEY,
// } from "../../config";
// const appAuthKey =
//   ENVIRONMENT == "development"
//     ? ONESIGNAL_TEST_AUTHKEY
//     : ONESIGNAL_LIVE_AUTHKEY;
// const appId =
//   ENVIRONMENT == "development" ? ONESIGNAL_TEST_APPID : ONESIGNAL_LIVE_APPID;
// const mypaddi = new OneSignal.Client({
//   app: {
//     appAuthKey,
//     appId,
//   },
// });
// const mypaddi = any;
/**
 * This function is used for send push notification
 * @param data
 */
const sendPush = async (data) => {
    const notification = new onesignal_node_1.default.Notification(data);
    if (!notification) {
        logger_1.logger.error("Failed to create notification");
        throw new app_error_1.AppError("Failed to create notification.");
    }
    const sent = joi_1.any;
    // const sent = await mypaddi.sendNotification(notification);
    if (!sent) {
        logger_1.logger.error("Failed to send notification");
        throw new app_error_1.AppError("Failed to send notification.");
    }
    logger_1.logger.info(JSON.stringify(sent));
    return {
        status: true,
        data: sent,
    };
};
exports.sendPush = sendPush;
/**
 * This function is used for send post push
 * @param data
 */
const sendPostPush = async (data) => {
    const notification = new onesignal_node_1.default.Notification(data);
    if (!notification) {
        logger_1.logger.error("Failed to create notification");
        throw new app_error_1.AppError("Failed to create notification.");
    }
    const sent = joi_1.any;
    // const sent = await mypaddi.sendNotification(notification);
    if (!sent) {
        logger_1.logger.error("Failed to send notification");
        throw new app_error_1.AppError("Failed to send notification.");
    }
    logger_1.logger.info(JSON.stringify(sent));
    return {
        status: true,
        data: sent,
    };
};
exports.sendPostPush = sendPostPush;
//# sourceMappingURL=push.js.map