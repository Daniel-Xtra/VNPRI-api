import { IBaseInterface } from "../baseInterface";

export interface IVehicle extends IBaseInterface {
  // type any is used to prevent error on validation level
  name: any;
  plate_number: any;
  color: any;
  fuel_type: any;
  vehicle_type: any;
  chassis_no: any;
  engine_capacity: any;
  tank_capacity: any;
  category: any;
  owner_identification: any;
  identification_no: any;
  driver_license_no: any;
  license_bearer_name: any;
  state_of_plateNo_allocation: any;
  title: any;
  first_name: any;
  last_name: any;
  gender: any;
  email: any;
  phone_number: any;
  address: any;
}
