import bcryptjs from "bcryptjs";
import { UserModel } from "./userModel";
import { AppError } from "../../utils/app-error";
import { ProfileModel } from "../Profile";

import { USER_EXCLUDES } from "../../utils/helpers";

import moment from "moment";
import { AccountModel, IUser, UserConnectionsModel } from ".";

import { DB } from "../../shared/database";

export class UserService {
  /**
   * Function responsible for get user
   * @param {string} username
   * @returns user
   * @memberof UserController
   */

  public getUser = async (username: string) => {
    // find user from user model by username
    let user = await UserModel.findOne({
      where: { username },
      attributes: {
        exclude: ["password", "email_verification_code", "auth_key"],
      },
      include: [
        {
          model: ProfileModel,
          required: true,
          attributes: {
            exclude: ["updated_at", "deleted_at", "userId"],
          },
        },
        {
          model: AccountModel,
          as: "accounts",
          required: false,
          attributes: {
            exclude: ["updated_at", "deleted_at", "userId"],
          },
        },
      ],
    });

    // check if user exists then the next operation can perform,or not
    if (user) {
      return user;
    }
    throw new AppError(`User '${username}' not found.`, null, 404);
  };

  /**
   * Updates a user resource
   * @public
   * @param {Object} user the current user
   * @param {Object} data the data to be updated
   * @returns {(Object|null)} the updated user resource
   * @memberof UserController
   */

  public updateUser = async (user: IUser, data: IUser) => {
    let username = user.username;
    // let new_username = user.username;
    if (data.username) {
      // check if username updated
      if (user.username_updated) {
        throw new AppError("Cannot edit username");
      }
      if (data.username != username) {
        // username = data.username;
        data.username_updated = 1;
      }
    }

    if (data.password) {
      // bcrypt the password
      data.password = bcryptjs.hashSync(data.password, 10);
    }
    if (data.username != username) {
      // update user name
      const updated = await UserModel.update(data, { where: { username } });
      if (!updated) {
        throw new AppError("Could not update user data");
      }
      username = data.username;
      return await this.getUser(username);
    }
    // username = user.username;
    const updated = await UserModel.update(data, { where: { username } });
    if (!updated) {
      throw new AppError("Could not update user data");
    }
    return await this.getUser(username);
  };

  /**
   * Get user status
   * @param {string} username of user
   * @returns user
   * @memberof UserController
   */

  public getUserStatus = async (username: string) => {
    // find user from user model by username
    let user = await UserModel.findOne({
      where: { username },
      attributes: {
        exclude: USER_EXCLUDES,
      },
      include: [
        {
          model: UserConnectionsModel,
          attributes: ["socket_id"],
        },
      ],
    });

    if (user) {
      user = user.toJSON();
      // user.isOnline = user.socket_id != null ? true : false;
      user.isOnline =
        user.user_connections && user.user_connections.length > 0
          ? true
          : false;
      delete user.user_connections;
      return user;
    }

    throw new AppError(`User ${username} not found`, null, 404);
  };

  /**
   * Update doctor status
   * @param {string} status
   * @param {string} user
   * @returns user
   * @memberof UserController
   */

  public updateStatus = async (status, user: any) => {
    let data: any = {};
    let now_momemnt = moment();
    let today_rate: any;
    // check status is true or false
    if (status == "true") {
      data.online_time = now_momemnt.toDate();
      const saved = await AccountModel.create(data);
      // update user_status of user model by username
      const updated = await UserModel.update(
        { user_status: status },
        { where: { username: user.username } }
      );
      if (saved && user.addAccounts(saved) && updated) {
        let username = user.username;
        return await this.getUser(username);
      }
      throw new AppError("Could not save user data");
    } else {
      // find today_rate from account model by userId
      today_rate = await AccountModel.findOne({
        where: {
          offline_time: "",
          userId: user.id,
        },
      });
      // check today_rate is present or not
      if (!today_rate) {
        data.online_time = user.updated_at;
        const saved = await AccountModel.create(data);
        today_rate = await user.addAccounts(saved);
      }
      data.offline_time = now_momemnt.toDate();
      data.hour_used = moment
        .duration(moment(data.offline_time).diff(today_rate.online_time))
        .hours();
      // update account of account model by userId
      const updated_account = await AccountModel.update(data, {
        where: { userId: user.id },
      });

      // update user_status of user model by username
      const updated = await UserModel.update(
        { user_status: status },
        { where: { username: user.username } }
      );
      if (!updated && !updated_account) {
        throw new AppError("Could not update user data");
      }
      let username = user.username;
      // return user
      return await this.getUser(username);
    }
  };

  public getBlockUsers = async (user: IUser) => {
    // const blockedUsers = await BlockListModel.findAll({ where: { block_id: user.id } });

    const blockedUsers = await DB.query(
      `SELECT U.id,U.username,U.email,U.first_name,
        U.last_name,U.gender,U.membership_type,U.verified,
        PR.profile_picture_url
        FROM block_users AS B JOIN users AS U ON B.user_id = U.id
        LEFT JOIN profiles PR ON PR.user_id = U.id WHERE B.block_id =${user.id}`,
      {
        type: (<any>DB).QueryTypes.SELECT,
      }
    );
    if (blockedUsers) {
      return blockedUsers;
    }
    throw new AppError(`Blocked Users not found`, null, 404);
  };
}
