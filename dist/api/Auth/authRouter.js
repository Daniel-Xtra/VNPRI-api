"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = require("../../middleware/passport");
const validation_1 = require("../../middleware/validation");
const controllerHandler_1 = require("./../../shared/controllerHandler");
const authController_1 = require("./authController");
const authValidation_1 = require("./authValidation");
const middleware_1 = require("../../middleware");
const router = express_1.default.Router();
const call = controllerHandler_1.controllerHandler;
const Auth = new authController_1.AuthController();
passport_1.default.use("signup", passport_2.signupStrategy);
passport_1.default.use("adminSignup", passport_2.adminSignupStrategy);
passport_1.default.use("login", passport_2.loginStrategy);
passport_1.default.use("adminLogin", passport_2.adminLoginStrategy);
router.post("/signup", [
    validation_1.validation(authValidation_1.SignupValidationSchema),
    middleware_1.adminAuthorize,
    passport_1.default.authenticate("signup", { session: false }),
], call(Auth.signup, (req, res, next) => [req.user]));
router.post("/admin-signup", [
    validation_1.validation(authValidation_1.adminSignupValidationSchema),
    passport_1.default.authenticate("adminSignup", { session: false }),
], call(Auth.signup, (req, res, next) => [req.user]));
router.post("/signin", [validation_1.validation(authValidation_1.LoginValidationSchema)], call(Auth.login, (req, res, next) => [req, res, next]));
router.post("/admin-signin", [validation_1.validation(authValidation_1.LoginValidationSchema)], call(Auth.adminLogin, (req, res, next) => [req, res, next]));
router.post("/logout", middleware_1.authorize, call(Auth.logout, (req, _res, _next) => [req.user]));
router.post("/request-reset/:email", call(Auth.requestPasswordReset, (req, _res, _next) => [
    req.params.email,
    req.body,
]));
router.get("/verify-code", call(Auth.verifyResetCode, (req, _res, _next) => [req.query.c]));
router.get("/validate-username/:username", call(Auth.validateUsername, (req, _res, _next) => [req.params.username]));
router.get("/validate-email/:email", call(Auth.validateEmail, (req, _res, _next) => [req.params.email]));
router.get("/validate-phone/:phone", call(Auth.validatePhone, (req, _res, _next) => [req.params.phone]));
router.post("/reset-password", call(Auth.resetPassword, (req, _res, _next) => [
    req.body.code,
    req.body.password,
]));
router.post("/refresh-token", validation_1.validation(authValidation_1.RefreshTokensValidationSchema), call(Auth.refreshTokens, (req, res, next) => [req.body.refreshToken]));
router.post("/:id/generateTokens", validation_1.validation(authValidation_1.RefreshTokensValidationSchema), call(Auth.refreshTokensById, (req, res, next) => [
    req.params.id,
    req.body.refreshToken,
]));
router.get("/", (rq, rs) => rs.send("good"));
exports.AuthRouter = router;
//# sourceMappingURL=authRouter.js.map