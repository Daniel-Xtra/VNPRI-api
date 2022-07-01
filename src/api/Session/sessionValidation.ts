import Joi from "joi";
import { ISession } from "./ISession";

export const SessionValidationSchema = Joi.object().keys(<ISession> {
    type: Joi.string(),
});
