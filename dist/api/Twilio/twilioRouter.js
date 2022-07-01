"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioRouter = void 0;
const express_1 = __importDefault(require("express"));
const controllerHandler_1 = require("../../shared/controllerHandler");
const twilioController_1 = require("./twilioController");
const router = express_1.default.Router();
const call = controllerHandler_1.controllerHandler;
const Twilio = new twilioController_1.TwilioController();
router.post("/inbound", call(Twilio.chat, (req, _res, _next) => [req.body.Body, req.body.From]));
exports.TwilioRouter = router;
//# sourceMappingURL=twilioRouter.js.map