"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRouter = void 0;
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../../middleware");
const controllerHandler_1 = require("../../shared/controllerHandler");
const notificationController_1 = require("./notificationController");
const router = express_1.default.Router();
const call = controllerHandler_1.controllerHandler;
const Notification = new notificationController_1.NotificationController();
router.use(middleware_1.authorize);
router.get("/", call(Notification.getUserNotifications, (req, _res, _next) => [req.user]));
router.post("/read-all", call(Notification.readAll, (req, _res, _next) => [req.user]));
router.post("/read-one/:id", call(Notification.readOne, (req, _res, _next) => [req.user, req.params.id]));
router.post("/save-device", call(Notification.saveDevice, (req, _res, _next) => [req.user, req.body]));
router.post("/settings", call(Notification.updateSettings, (req, _res, _next) => [req.user, req.body]));
router.get("/settings", call(Notification.getSettings, (req, _res, _next) => [req.user]));
exports.NotificationRouter = router;
//# sourceMappingURL=notificationRouter.js.map