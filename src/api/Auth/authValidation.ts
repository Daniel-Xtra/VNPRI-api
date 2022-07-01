import Joi from "joi";

export const LoginValidationSchema = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().required(),
  code: Joi.string(),
});

export const SignupValidationSchema = Joi.object().keys({
  username: Joi.string()
    .regex(/^[a-zA-Z0-9._-]{3,16}$/i)
    .required(),
  first_name: Joi.string().max(30).required(),
  last_name: Joi.string().max(30).required(),
  email: Joi.string().email().required(),
  phone_number: Joi.number().required(),
  gender: Joi.string().required(),

  membership_type: Joi.string(),
  code: Joi.string(),
});

export const adminSignupValidationSchema = Joi.object().keys({
  username: Joi.string()
    .regex(/^[a-zA-Z0-9._-]{3,16}$/i)
    .required(),
  password: Joi.string().min(6).max(32).required(),
  first_name: Joi.string().max(30).required(),
  last_name: Joi.string().max(30).required(),
  email: Joi.string().email().required(),
  phone_number: Joi.number().required(),
  gender: Joi.string().required(),

  membership_type: Joi.string(),
  code: Joi.string(),
});

export const RefreshTokensValidationSchema = Joi.object().keys({
  refreshToken: Joi.string().required(),
});
