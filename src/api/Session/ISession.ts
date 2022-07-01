import { IBaseInterface } from "../baseInterface";

export interface ISession extends IBaseInterface {
    // type any is used to prevent error on validation level
    // profile data
    type: any;
}
