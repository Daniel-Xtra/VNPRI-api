import { BaseController } from "../baseController";
import { UserService } from "./userService";
import { IUser } from ".";

/**
 * User controller
 *
 * @export
 * @class UserController
 */

export class UserController extends BaseController {
  private _userService = new UserService();

  public index = () => {
    return this.sendResponse("hello!");
  };

  /**
   * This function is used for get user
   * @param username
   */

  public getUser = async (username: string) => {
    // responsible for get user
    const user = await this._userService.getUser(username);
    return this.sendResponse(user);
  };

  /**
   * This function is used for update user
   * @param user
   * @param data
   */

  public updateUser = async (user: IUser, data: IUser) => {
    // responsible for update user
    const updated = await this._userService.updateUser(user, data);
    return this.sendResponse(updated);
  };

  /**
   * This function is used for update status
   * @param status
   * @param user
   */

  public updateStatus = async (status: boolean, user: IUser) => {
    // responsible for update status
    const doc_status = await this._userService.updateStatus(status, user);
    return this.sendResponse(doc_status);
  };

  public getUserStatus = async (username: string) => {
    // responsible for get user status
    const user = await this._userService.getUserStatus(username);
    return this.sendResponse(user);
  };

  public getBlockUsers = async (user: IUser) => {
    const block = await this._userService.getBlockUsers(user);
    return this.sendResponse(block);
  };
}
