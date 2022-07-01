import express from "express";
import { authorize, adminAuthorize, validation } from "../../middleware";
import { controllerHandler } from "../../shared/controllerHandler";
import { VehicleController } from "./vehicleController";
import { VehicleValidationSchema } from "./vehicleValidation";

const router = express.Router();
const call = controllerHandler;
const Vehicle = new VehicleController();

// router.use(authorize);
router.use(validation(VehicleValidationSchema));

router.get(
  "/",
  call(Vehicle.index, (req, res, next) => [])
);

router.get(
  "/:plate_number",
  authorize,
  call(Vehicle.getVehicle, (req, res, next) => [
    req.params.plate_number,
    req.user,
  ])
);

router.post(
  "/create",
  adminAuthorize,
  call(Vehicle.regVehicle, (req, res, next) => [req.body])
);

router.delete(
  "/:plate_number/delete",
  adminAuthorize,
  call(Vehicle.delVehicle, (req, res, next) => [req.params.plate_number])
);

router.get(
  "/:email/owner",
  call(Vehicle.getOwner, (req, res, next) => [req.params.email])
);

export const VehicleRouter = router;
