import Joi from "joi";

import { IReport } from "./IReport";

export const ReportValidationSchema = Joi.object().keys(<IReport>{
  reason: Joi.string(),
});
