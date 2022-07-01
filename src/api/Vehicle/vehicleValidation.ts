import Joi from "joi";

import { IVehicle } from "./IVehicle";

export const VehicleValidationSchema = Joi.object().keys(<IVehicle>{
  name: Joi.string().required(),
  plate_number: Joi.string().required().uppercase(),
  color: Joi.string().required(),
  fuel_type: Joi.string().required(),
  vehicle_type: Joi.string().required(),
  chassis_no: Joi.string().required(),
  engine_capacity: Joi.string().required(),
  tank_capacity: Joi.string().required(),
  category: Joi.string().required(),
  owner_identification: Joi.string().required(),
  identification_no: Joi.string().required(),
  driver_license_no: Joi.string().required(),
  license_bearer_name: Joi.string().required(),
  state_of_plateNo_allocation: Joi.string().required(),
  first_name: Joi.string().max(30).required(),
  last_name: Joi.string().max(30).required(),
  email: Joi.string().email({ minDomainAtoms: 2 }).required(),
  phone_number: Joi.string()
    .regex(/^[0-9+]{11}$/)
    .required(),
  gender: Joi.string().required(),
  title: Joi.string().required(),
  address: Joi.string().required(),
});
