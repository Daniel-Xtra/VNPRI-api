"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRouter = void 0;
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../../middleware");
const controllerHandler_1 = require("../../shared/controllerHandler");
const adminController_1 = require("./adminController");
const router = express_1.default.Router();
const call = controllerHandler_1.controllerHandler;
const Admin = new adminController_1.AdminController();
// router.use(adminAuthorize);
router.get("/manage-users", [middleware_1.adminAuthorize], call(Admin.getAllUsers, (req, _res, _next) => [
    req.user,
    req.query.per_page,
    req.query.post_next,
    req.query.post_prev,
]));
router.get("/manage-coupons", [middleware_1.adminAuthorize], call(Admin.getAllCoupons, (req, _res, _next) => [
    req.user,
    req.query.per_page,
    req.query.post_next,
    req.query.post_prev,
]));
router.get("/manage-topics", [middleware_1.adminAuthorize], call(Admin.getAllTopics, (req, _res, _next) => [
    req.user,
    req.query.per_page,
    req.query.post_next,
    req.query.post_prev,
]));
router.get("/manage-orders", [middleware_1.adminAuthorize], call(Admin.getAllOrders, (req, _res, _next) => [
    req.user,
    req.query.per_page,
    req.query.order_next,
    req.query.order_prev,
]));
router.get("/manage-docs-couns", [middleware_1.adminAuthorize], call(Admin.getAllDocsCouns, (req, _res, _next) => [req.user]));
router.get("/search", [middleware_1.adminAuthorize], call(Admin.searchCollection, (req, _res, _next) => [
    req.query.q,
    req.query.f,
    req.user,
    req.query.per_page,
    req.query.search_next,
    req.query.search_prev,
]));
exports.AdminRouter = router;
//# sourceMappingURL=adminRouter.js.map