"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../../middleware");
const controllerHandler_1 = require("../../shared/controllerHandler");
const userController_1 = require("./userController");
const userValidation_1 = require("./userValidation");
const router = express_1.default.Router();
const call = controllerHandler_1.controllerHandler;
const User = new userController_1.UserController();
router.use(middleware_1.authorize);
router.use(middleware_1.validation(userValidation_1.UserValidationSchema));
router.get("/", call(User.index, (req, res, next) => []));
router.put("/", call(User.updateUser, (req, res, next) => [req.user, req.body]));
router.get("/:username", call(User.getUser, (req, res, next) => [req.params.username]));
exports.UserRouter = router;
//# sourceMappingURL=userRouter.js.map