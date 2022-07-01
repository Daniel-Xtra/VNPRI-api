import express from "express";
import { authorize, validation } from "../../middleware";
import { controllerHandler } from "../../shared/controllerHandler";
import { SessionController } from "./sessionController";
import { SessionValidationSchema } from "./sessionValidation";

const router = express.Router();
const call = controllerHandler;
const Session = new SessionController();

router.use(authorize);
router.use(validation(SessionValidationSchema));

router.post("/end/:id", call(Session.endSession, (req, _res, _next) => [req.user, req.params.id, req.body]));

router.post("/start/:id", call(Session.startSession, (req, _res, _next) => [req.user, req.params.id, req.body]));

router.get("/:id", call(Session.getSessionStatus, (req, _res, _next) => [req.user, req.params.id]));

export const SessionRouter = router;
