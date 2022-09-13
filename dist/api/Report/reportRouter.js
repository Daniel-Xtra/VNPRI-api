"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportRouter = void 0;
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../../middleware");
const controllerHandler_1 = require("../../shared/controllerHandler");
const reportController_1 = require("./reportController");
const ReportValidation_1 = require("./ReportValidation");
const router = express_1.default.Router();
const call = controllerHandler_1.controllerHandler;
const Report = new reportController_1.ReportController();
router.use(middleware_1.authorize);
router.use(middleware_1.validation(ReportValidation_1.ReportValidationSchema));
router.post("/report/:plate_number", call(Report.report, (req, res, next) => [
    req.params.plate_number,
    req.user,
    req.body,
]));
router.get("/all", call(Report.allReport, (req, res, next) => []));
router.put("/resolve/:unique_id", middleware_1.adminAuthorize, call(Report.resolve, (req, res, next) => [req.params.unique_id]));
exports.ReportRouter = router;
//# sourceMappingURL=reportRouter.js.map