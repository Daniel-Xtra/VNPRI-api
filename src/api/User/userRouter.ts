import express from "express";
import { authorize, validation } from "../../middleware";
import { controllerHandler } from "../../shared/controllerHandler";
import { UserController } from "./userController";
import { UserValidationSchema } from "./userValidation";

const router = express.Router();
const call = controllerHandler;
const User = new UserController();

router.use(authorize);
router.use(validation(UserValidationSchema));

router.get(
  "/",
  call(User.index, (req, res, next) => [])
);

router.get(
  "/blocked",
  call(User.getBlockUsers, (req, _res, _next) => [req.user])
);

router.put(
  "/",
  call(User.updateUser, (req, res, next) => [req.user, req.body])
);

router.get(
  "/:username",
  call(User.getUser, (req, res, next) => [req.params.username])
);

router.get(
  "/:username/status",
  call(User.getUserStatus, (req, _res, _next) => [req.params.username])
);

router.get(
  "/blocked",
  call(User.getBlockUsers, (req, res, next) => [req.user])
);

export const UserRouter = router;
