import express from "express";
import { adminAuthorize, authorize, validation } from "../../middleware";

import { controllerHandler } from "../../shared/controllerHandler";
import { ReportController } from "./reportController";
import { ReportValidationSchema } from "./ReportValidation";

const router = express.Router();
const call = controllerHandler;
const Report = new ReportController();

router.use(authorize);
router.use(validation(ReportValidationSchema));

router.post(
  "/report/:plate_number",

  call(Report.report, (req, res, next) => [
    req.params.plate_number,
    req.user,
    req.body,
  ])
);

router.get(
  "/all",
  call(Report.allReport, (req, res, next) => [])
);

router.put(
  "/resolve/:unique_id",
  adminAuthorize,
  call(Report.resolve, (req, res, next) => [req.params.unique_id])
);

export const ReportRouter = router;
