import { BaseController } from "../baseController";
import { SessionService } from "./sessionService";
import { IUser } from "../User";
import { ISession } from ".";

/**
 * Session controller
 *
 * @export
 * @class SessionController
 */
export class SessionController extends BaseController {
  private _sessionService = new SessionService();

  public index = () => {
    return this.sendResponse("Session");
  }

  /**
   * This function is used for get session status
   * @param user
   * @param id
   */

  public getSessionStatus = async (user: IUser, id: number) => {
    const status = await this._sessionService.getSessionStatus(user, id);
    return this.sendResponse(status);
  }

  /**
   * This function is used for start session
   * @param user
   * @param id
   * @param data
   */

  public startSession = async (user: IUser, id: number, data: ISession) => {
    let type = data && data.type ? data.type : "doctor";
    const session = await this._sessionService.startSession(user, id, type);
    return this.sendResponse(session);
  }

  /**
   * This function is used for end session
   * @param user
   * @param id
   */

  public endSession = async (user: IUser, id: number) => {
    const session = await this._sessionService.endSession(user, id);
    return this.sendResponse(session);
  }
}
