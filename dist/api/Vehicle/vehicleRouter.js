"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleRouter = void 0;
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../../middleware");
const controllerHandler_1 = require("../../shared/controllerHandler");
const vehicleController_1 = require("./vehicleController");
const vehicleValidation_1 = require("./vehicleValidation");
const router = express_1.default.Router();
const call = controllerHandler_1.controllerHandler;
const Vehicle = new vehicleController_1.VehicleController();
// router.use(authorize);
router.use(middleware_1.validation(vehicleValidation_1.VehicleValidationSchema));
router.get("/", call(Vehicle.index, (req, res, next) => []));
router.get("/:plate_number", middleware_1.authorize, call(Vehicle.getVehicle, (req, res, next) => [
    req.params.plate_number,
    req.user,
]));
router.post("/create", middleware_1.adminAuthorize, call(Vehicle.regVehicle, (req, res, next) => [req.body]));
router.delete("/:plate_number/delete", middleware_1.adminAuthorize, call(Vehicle.delVehicle, (req, res, next) => [req.params.plate_number]));
router.get("/:email/owner", call(Vehicle.getOwner, (req, res, next) => [req.params.email]));
exports.VehicleRouter = router;
//# sourceMappingURL=vehicleRouter.js.map