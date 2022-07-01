"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileRouter = void 0;
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../../middleware");
const controllerHandler_1 = require("../../shared/controllerHandler");
const profileController_1 = require("./profileController");
const profileValidation_1 = require("./profileValidation");
const router = express_1.default.Router();
const call = controllerHandler_1.controllerHandler;
const Profile = new profileController_1.ProfileController();
router.use(middleware_1.authorize);
router.use(middleware_1.validation(profileValidation_1.ProfileValidationSchema));
router.get("/", call(Profile.index, (req, _res, _next) => [req.params]));
router.get("/:username", call(Profile.getProfile, (req, _res, _next) => [req.params.username]));
router.put("/", call(Profile.editProfile, (req, res, next) => [req.user, req.body]));
router.post("/upload", [middleware_1.FrontendAssetsUpload.single("photo")], call(Profile.saveProfilePhoto, (req, res, next) => [req.user, req.file]));
exports.ProfileRouter = router;
//# sourceMappingURL=profileRouter.js.map