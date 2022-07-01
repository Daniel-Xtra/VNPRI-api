import Joi from "joi";
import { INotification } from "./INotification";

export const NotificationValidationSchema = Joi.object().keys(<INotification> {
    message: Joi.string().trim().required(),
    context: Joi.string().trim().required(),
    triggered_by: Joi.number(),
});
