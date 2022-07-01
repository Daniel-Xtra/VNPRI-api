import express from "express";
import { controllerHandler } from "../../shared/controllerHandler";
import { TwilioController } from "./twilioController";

const router = express.Router();
const call = controllerHandler;
const Twilio = new TwilioController();

router.post(
  "/inbound",
  call(Twilio.chat, (req, _res, _next) => [req.body.Body, req.body.From])
);

export const TwilioRouter = router;
