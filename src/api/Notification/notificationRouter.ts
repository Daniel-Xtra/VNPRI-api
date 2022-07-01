import express from "express";
import { authorize } from "../../middleware";
import { controllerHandler } from "../../shared/controllerHandler";
import { NotificationController } from "./notificationController";

const router = express.Router();
const call = controllerHandler;
const Notification = new NotificationController();

router.use(authorize);

router.get(
  "/",
  call(Notification.getUserNotifications, (req, _res, _next) => [req.user])
);

router.post(
  "/read-all",
  call(Notification.readAll, (req, _res, _next) => [req.user])
);

router.post(
  "/read-one/:id",
  call(Notification.readOne, (req, _res, _next) => [req.user, req.params.id])
);

router.post(
  "/save-device",
  call(Notification.saveDevice, (req, _res, _next) => [req.user, req.body])
);

router.post(
  "/settings",
  call(Notification.updateSettings, (req, _res, _next) => [req.user, req.body])
);

router.get(
  "/settings",
  call(Notification.getSettings, (req, _res, _next) => [req.user])
);

export const NotificationRouter = router;
