import OneSignal from "onesignal-node";
import { IPushData, IPostPushData } from "./INotification";
import { AppError } from "../../utils/app-error";
import { logger } from "../../utils/logger";
import { any } from "joi";
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

export const sendPush = async (data: IPushData) => {
  const notification = new OneSignal.Notification(data);
  if (!notification) {
    logger.error("Failed to create notification");
    throw new AppError("Failed to create notification.");
  }
  const sent = any;
  // const sent = await mypaddi.sendNotification(notification);

  if (!sent) {
    logger.error("Failed to send notification");
    throw new AppError("Failed to send notification.");
  }

  logger.info(JSON.stringify(sent));

  return {
    status: true,
    data: sent,
  };
};

/**
 * This function is used for send post push
 * @param data
 */

export const sendPostPush = async (data: IPostPushData) => {
  const notification = new OneSignal.Notification(data);

  if (!notification) {
    logger.error("Failed to create notification");
    throw new AppError("Failed to create notification.");
  }
const sent = any;
  // const sent = await mypaddi.sendNotification(notification);
  if (!sent) {
    logger.error("Failed to send notification");
    throw new AppError("Failed to send notification.");
  }
  logger.info(JSON.stringify(sent));
  return {
    status: true,
    data: sent,
  };
};
