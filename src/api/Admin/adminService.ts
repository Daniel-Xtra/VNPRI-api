import { UserModel } from "../User/userModel";
import { Op } from "sequelize";
import moment from "moment";

import { USER_EXCLUDES, PROFILE_EXCLUDES } from "../../utils/helpers";
import { ProfileModel } from "../Profile/profileModel";
import { AppError } from "../../utils/app-error";
import bcryptjs from "bcryptjs";

import { SessionModel } from "../Session/sessionModel";

import { IUser } from "../User";

export class AdminService {
  /**
   * Get Admin Home
   * @param {Object} user the current user
   * @memberof AdminController
   */

  public getAdminHome = async (user: IUser) => {
    // home screen for admin
    const TODAY_START = new Date(new Date().setHours(0, 0, 0, 0));
    const NOW = new Date();
    let WEEK_AGO = new Date(
      new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).setHours(
        0,
        0,
        0,
        0
      )
    );
    let MONTH_AGO = new Date(
      new Date(moment().subtract(1, "months").format()).setHours(0, 0, 0, 0)
    );
    let YEAR_AGO = new Date(
      new Date(moment().subtract(1, "years").format()).setHours(0, 0, 0, 0)
    );
    const signups = await this.signups_details(
      TODAY_START,
      NOW,
      WEEK_AGO,
      MONTH_AGO,
      YEAR_AGO
    );
    const topics = await this.topics_details(
      TODAY_START,
      NOW,
      WEEK_AGO,
      MONTH_AGO,
      YEAR_AGO
    );
    const comments = await this.comments_details(
      TODAY_START,
      NOW,
      WEEK_AGO,
      MONTH_AGO,
      YEAR_AGO
    );
    return { signups, topics, comments };
  };

  /**
   * Get All Topics
   * @param {Object} user the current user
   * @param {Number} per_page
   * @param {String} post_next
   * @param {String} post_prev
   * @memberof AdminController
   */

  public getAllTopics = async (
    user: IUser,
    per_page: number = 15,
    post_next: string,
    post_prev: string
  ) => {
    // responsible for paginate in post model

    throw new AppError("No topics found", null, 404);
  };

  /**
   * Get All Orders
   * @param {Object} user the current user
   * @param {Number} per_page
   * @param {String} order_next
   * @param {String} order_prev
   * @memberof AdminController
   */

  public getAllOrders = async (
    user: IUser,
    per_page: number = 15,
    order_next: string,
    order_prev: string
  ) => {
    // responsible for paginate orders by order_status

    throw new AppError("No order found", null, 404);
  };

  /**
   * Get All Users
   * @param {Object} user the current user
   * @param {Number} per_page
   * @param {String} post_next
   * @param {String} post_prev
   * @memberof AdminController
   */

  public getAllUsers = async (
    user: IUser,
    per_page: number = 15,
    post_next: string,
    post_prev: string
  ) => {
    const limit: number = Number(per_page);
    // responsible for paginate users with given limit
    let users = await (<any>UserModel).paginate({
      limit,
      desc: true,
      before: post_prev,
      after: post_next,
      attributes: [
        "id",
        "username",
        "email",
        "phone_number",
        "first_name",
        "last_name",
        "gender",
        "date_of_birth",
        "membership_type",
        "verified",
        "socket_id",
        "player_id",
        "pass_updated",
        "created_at",
        "updated_at",
      ],
      where: {
        membership_type: {
          [Op.ne]: "admin",
        },
      },
      include: [
        {
          model: ProfileModel,
          attributes: {
            exclude: PROFILE_EXCLUDES,
          },
        },
      ],
    });

    if (users) {
      // responsible for count total users
      const totalUsers = await UserModel.count();
      return {
        users: users.results,
        cursors: users.cursors,
        totalUsers,
      };
    }
    throw new AppError("No users found", null, 404);
  };

  /**
   * Get all coupons
   * @param {Object} user the current user
   * @param {Number} per_page
   * @param {String} post_next
   * @param {String} post_prev
   * @returns users , cursors and total coupons on success
   * @memberof AdminController
   */

  public getAllCoupons = async (
    user: IUser,
    per_page: number = 15,
    post_next: string,
    post_prev: string
  ) => {
    throw new AppError("No Coupons found", null, 404);
  };

  /**
   * Get all docs couns
   * @param {Object} user the current user
   * @returns docsCouns on success
   * @memberof AdminController
   */

  public getAllDocsCouns = async (user: IUser) => {
    // responsible for find all docsCouns by membership_type
    let DocsCouns = await UserModel.findAll({
      where: {
        membership_type: {
          [Op.or]: ["doctor", "counsellor"],
        },
      },
      attributes: [
        "id",
        "username",
        "email",
        "phone_number",
        "first_name",
        "last_name",
        "gender",
        "date_of_birth",
        "membership_type",
        "verified",
        "socket_id",
        "player_id",
        "pass_updated",
        "created_at",
        "updated_at",
      ],
      include: [
        {
          model: ProfileModel,
          attributes: {
            exclude: PROFILE_EXCLUDES,
          },
        },
      ],
    });
    if (DocsCouns) {
      return DocsCouns;
    }
    throw new AppError("No doctors/counsellors found", null, 404);
  };

  /**
   * Get all sessions
   * @param {Object} user the current user
   * @param {Number} per_page
   * @param {String} sess_next
   * @param {String} sess_prev
   * @returns users , cursors and totalSessions on success
   * @memberof AdminController
   */

  public getAllSessions = async (
    user: IUser,
    per_page: number = 15,
    sess_next: string,
    sess_prev: string
  ) => {
    const limit: number = Number(per_page);
    // responsible for paginate sessions with given limit
    let sessions = await (<any>SessionModel).paginate({
      limit,
      desc: true,
      before: sess_prev,
      after: sess_next,
      include: [
        {
          model: UserModel,
          attributes: {
            exclude: USER_EXCLUDES,
          },
        },
      ],
    });

    if (sessions) {
      // responsible for count total sessions
      const totalSessions = await SessionModel.count();
      return {
        users: sessions.results,
        cursors: sessions.cursors,
        totalSessions,
      };
    }
    throw new AppError("No sessions found", null, 404);
  };

  /**
   * Gets the list of user sessions available
   * @returns {Array<Objct>} on success
   * @memberof AdminController
   */

  public getUserSessions = async (username: any) => {
    // check for the user if exist
    const user = await UserModel.findOne({ where: { username } });
    if (!user) {
      throw new AppError("User not found.", null, 404);
    }
    // responsible for find user sessions
    let sessions = await SessionModel.findAll({
      where: { userId: user.id },
      order: [["id", "desc"]],
    });
    if (sessions) {
      sessions = await Promise.all(
        sessions.map(async (session) => {
          session = session.toJSON();
          // check condition if socket_id of doctor is null or not
          session.with_user = await UserModel.findOne({
            where: { id: session.with_user },
            attributes: {
              exclude: ["password", "email_verification_code", "auth_key"],
            },
          });
          return session;
        })
      );
      return sessions;
    }

    throw new AppError("No user sessions exist at the time", null, 404);
  };

  /**
   * Updates a user resource
   * @public
   * @param {String} username the current user
   * @param {Object} data the data to be updated
   * @returns {(Object|null)} the updated user resource
   * @memberof AdminController
   */

  public updateUser = async (username: string, data: any) => {
    if (data.username) {
      throw new AppError("Cannot edit username");
    }

    if (data.password) {
      data.password = bcryptjs.hashSync(data.password, 10);
    }

    // update user data by username
    const updated = await UserModel.update(data, { where: { username } });
    if (!updated) {
      throw new AppError("Could not update user data");
    }
    return await this.getUser(username);
  };

  /**
   * Get user
   * @param {String} username
   * @returns user on success
   * @memberof AdminController
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
          attributes: {
            exclude: ["updated_at", "deleted_at", "userId"],
          },
        },
      ],
    });

    if (user) {
      return user;
    }
    throw new AppError(`User '${username}' not found.`, null, 404);
  };

  /**
   * Signup details
   * @param {Any} TODAY_START
   * @param {Any} NOW
   * @param {Any} WEEK_AGO
   * @param {Any} MONTH_AGO
   * @param {Any} YEAR_AGO
   * @returns user_counts on success
   * @memberof AdminController
   */

  public signups_details = async (
    TODAY_START: any,
    NOW: any,
    WEEK_AGO: any,
    MONTH_AGO: any,
    YEAR_AGO: any
  ) => {
    let AGO_DATE = new Date(new Date(moment().subtract(5, "seconds").format()));
    // count total_users by membership_type
    let total_users = await UserModel.count({
      where: {
        membership_type: {
          [Op.eq]: "user",
        },
      },
    });
    // count online users by updated_at time
    let users_online = await UserModel.count({
      where: {
        updated_at: {
          [Op.gt]: AGO_DATE,
          [Op.lt]: NOW,
        },
      },
    });
    // count total signups today by created_at time
    let total_signups_today = await UserModel.count({
      where: {
        created_at: {
          [Op.gt]: TODAY_START,
          [Op.lt]: NOW,
        },
      },
    });
    // count total_signup_week by created_at time
    let total_signups_week = await UserModel.count({
      where: {
        created_at: {
          [Op.gt]: WEEK_AGO,
          [Op.lt]: NOW,
        },
      },
    });
    // count total_signup_month by created_at time
    let total_signups_month = await UserModel.count({
      where: {
        created_at: {
          [Op.gt]: MONTH_AGO,
          [Op.lt]: NOW,
        },
      },
    });
    // count total_signup_year by created_at time
    let total_signups_year = await UserModel.count({
      where: {
        created_at: {
          [Op.gt]: YEAR_AGO,
          [Op.lt]: NOW,
        },
      },
    });
    const user_counts = {
      total_users,
      users_online,
      total_signups_today,
      total_signups_weekAgo: total_signups_week,
      total_signups_monthAgo: total_signups_month,
      total_signups_yearAgo: total_signups_year,
    };
    return user_counts;
  };

  /**
   * Topics details
   * @param {Any} TODAY_START
   * @param {Any} NOW
   * @param {Any} WEEK_AGO
   * @param {Any} MONTH_AGO
   * @param {Any} YEAR_AGO
   * @returns topic_counts on success
   * @memberof AdminController
   */

  public topics_details = async (
    TODAY_START: any,
    NOW: any,
    WEEK_AGO: any,
    MONTH_AGO: any,
    YEAR_AGO: any
  ) => {};

  /**
   * Comments details
   * @param {Any} TODAY_START
   * @param {Any} NOW
   * @param {Any} WEEK_AGO
   * @param {Any} MONTH_AGO
   * @param {Any} YEAR_AGO
   * @returns topic_counts on success
   * @memberof AdminController
   */

  public comments_details = async (
    TODAY_START: any,
    NOW: any,
    WEEK_AGO: any,
    MONTH_AGO: any,
    YEAR_AGO: any
  ) => {};

  /**
   * Search user admin
   * @param {String} query
   * @param {String} filter
   * @param {Object} user the current user
   * @param {Number} per_page
   * @param {String} search_next
   * @param {String} search_prev
   * @returns results ,cursors and total search on success
   * @memberof AdminController
   */

  public searchUserAdmin = async (
    query: string,
    filter: string,
    user: IUser,
    per_page: number = 15,
    search_next: string,
    search_prev: string
  ) => {
    const limit: number = Number(per_page);
    let results: any;
    let totalSearch: any;
    if (filter == "posts") {
    } else if (filter == "users") {
      results = await (<any>UserModel).paginate({
        limit,
        desc: true,
        before: search_prev,
        after: search_next,
        where: {
          [Op.or]: [
            {
              username: {
                [Op.like]: `%${query}%`,
              },
            },
            {
              email: {
                [Op.like]: `%${query}%`,
              },
            },
            {
              phone_number: {
                [Op.like]: `%${query}%`,
              },
            },
          ],
        },
        attributes: {
          exclude: [
            "email",
            "phone_number",
            "password",
            "first_name",
            "last_name",
            "date_of_birth",
            "email_verification_code",
            "socket_id",
            "auth_key",
            "updated_at",
            "deleted_at",
            "userId",
          ],
        },
        include: [
          {
            model: ProfileModel,
            attributes: {
              exclude: [
                "religion",
                "sexual_orientation",
                "relationship_status",
                "occupation",
                "ethnic_group",
                "highest_education",
                "current_education",
                "created_at",
                "updated_at",
                "deleted_at",
                "userId",
              ],
            },
          },
        ],
      });
      // responsible for count total search
      totalSearch = await UserModel.count();
    }
    if (results) {
      return {
        results: results.results,
        cursors: results.cursors,
        totalSearch,
      };
    }

    return "no results";
  };
}

//week
// SELECT YEAR(created_at) AS Year, DATE_FORMAT(created_at, '%Y/%v') AS Week, COUNT(*) AS total
//FROM users
//GROUP BY Year, Week;

//day
// SELECT YEAR(created_at) AS Year,DATE_FORMAT(created_at, '%Y/%m/%d') AS Day, COUNT(*) AS total
// FROM users
// GROUP BY Year,Day;

// months
// SELECT YEAR(created_at) AS Year,DATE_FORMAT(created_at, '%Y/%m') AS Month, COUNT(*) AS total
// FROM users
// GROUP BY Year,Month;

//Year
// SELECT YEAR(created_at) AS Year, COUNT(*) AS total
// FROM users
// GROUP BY Year;
