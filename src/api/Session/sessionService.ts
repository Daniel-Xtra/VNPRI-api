import moment from "moment";
import { SessionModel } from ".";
import { AppError } from "../../utils/app-error";
import { UserModel, IUser } from "../User";

export class SessionService {
  /**
   * Get session status
   * @param {Object} user the current user
   * @param {Number} id
   * @returns sessionStatus on success
   * @memberof SessionController
   */

  public getSessionStatus = async (user: IUser, id: number) => {
    // find session by current user_id and with_user
    const session = await SessionModel.findOne({
      where: {
        userId: user.id,
        with_user: id,
      },
    });

    if (session) {
      return {
        sessionStatus: session.session_state,
      };
    }

    throw new AppError("Not found", null, 404);
  }

  /**
   * Start session
   * @param {Object} user the current user
   * @param {Number} id
   * @param {String} type
   * @returns sessionStatus on success
   * @memberof SessionController
   */

  public startSession = async (user: any, id: number, type?: string) => {
    if (user.id == id) {
      throw new AppError("You cannot consult with yourself.");
    }

    // find session by current user_id and with_user
    const exSession = await SessionModel.findOne({
      where: {
        userId: user.id,
        with_user: id,
      },
    });
    // responsible for get active session
    const sessions_count = await this.getActiveSessions(user.id);

    const subscription = await user.getSubscription();

    if (subscription && subscription.coin_balance < 500) {
      throw new AppError("You do not have enough coins to start a session.");
    }

    if (subscription.coin_balance < (sessions_count + 1) * 500) {
      // tslint:disable-next-line: max-line-length
      throw new AppError(
        `You don't have enough coins to start a session because you have ${sessions_count} active sessions.`,
      );
    }

    if (exSession && exSession.session_state) {
      if (exSession.session_state == "active") {
        throw new AppError(
          `You already have an active session with this ${type}`,
        );
      }
      // responsible for update session_state and created_at by userId and with_user
      let updated = await SessionModel.update(
        { session_state: "active", created_at: moment() },
        {
          where: {
            userId: user.id,
            with_user: id,
          },
        },
      );
      if (updated) {
        return {
          sessionStatus: "active",
        };
      }
      throw new AppError("Could not start new session");
    }

    // responsible for create new session by with_user
    const session = await SessionModel.create({ with_user: id });
    if (session && user.addSession(session)) {
      return {
        sessionStatus: "active",
      };
    }

    throw new AppError("Could not start new session");
  }

  /**
   * End session
   * @param {Object} user the current user
   * @param {Number} id
   * @returns sessionStatus on success
   * @memberof SessionController
   */

  public endSession = async (user: IUser, id: number) => {
    // find session owner by id
    const sessionOwner = await UserModel.findByPk(id);
    // find session by userId , with_user and session_state
    const session = await SessionModel.findOne({
      where: {
        userId: id,
        with_user: user.id,
        session_state: "active",
      },
    });

    if (session) {
      // update session_state by user_id and with_user of current user


      // responsible for get subscription
      let subscription = await sessionOwner.getSubscription();
      subscription = subscription.toJSON();
      subscription.coin_balance = subscription.coin_balance - 500;
      // responsible for update coin balance by user_id

      // Add session history


    }

    throw new AppError("You don't have an active session with this user.");
  }

  /**
   * Get active sessions
   * @param {Number} id
   * @returns {Number} on success
   * @memberof SessionController
   */

  public getActiveSessions = async (id: number): Promise<number> => {
    // count active sessions by user_id and session_state
    return SessionModel.count({
      where: {
        userId: id,
        session_state: "active",
      },
    });
  }
}
