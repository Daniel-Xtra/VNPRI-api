"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionRouter = void 0;
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../../middleware");
const controllerHandler_1 = require("../../shared/controllerHandler");
const sessionController_1 = require("./sessionController");
const sessionValidation_1 = require("./sessionValidation");
const router = express_1.default.Router();
const call = controllerHandler_1.controllerHandler;
const Session = new sessionController_1.SessionController();
router.use(middleware_1.authorize);
router.use(middleware_1.validation(sessionValidation_1.SessionValidationSchema));
router.post("/end/:id", call(Session.endSession, (req, _res, _next) => [req.user, req.params.id, req.body]));
router.post("/start/:id", call(Session.startSession, (req, _res, _next) => [req.user, req.params.id, req.body]));
router.get("/:id", call(Session.getSessionStatus, (req, _res, _next) => [req.user, req.params.id]));
exports.SessionRouter = router;
//# sourceMappingURL=sessionRouter.js.map