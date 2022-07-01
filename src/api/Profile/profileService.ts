import { AppError } from "./../../utils/app-error";
import { ProfileModel, IProfile } from ".";
import { UserModel, AccountModel } from "../User";
import { Op } from "sequelize";
import moment from "moment";
import { DB } from "../../shared/database";
const { cloudinary } = require("../../middleware/cloudinary");
// require("dotenv").config;
export class ProfileService {
  /**
   * Gets the user profile
   * @param {string} username the username to look up
   * @returns profile or null
   * @memberof ProfileController
   */

  // public getUserProfile = async (username: string) => {
  //   // find user from user model by username
  //   const user = await UserModel.findOne({ where: { username } });
  //   if (user) {
  //     // get user profile excluding id and user_id
  //     const profile = await user.getProfile({
  //       attributes: { exclude: ["id", "user_id"] },
  //     });
  //     return profile ? profile : null;
  //   }
  //   return `User with ${username} not found`;
  // };

  public getUserProfile = async (username: string) => {
    // find user from user model by username
    const user = await UserModel.findOne({ where: { username } });
    if (user) {
      // get user profile excluding id and user_id
      const profile = await ProfileModel.findOne({
        where: { user_id: user.id },
        attributes: {
          exclude: ["id", "user_id"],
        },
        raw: true,
      });
      // get total number of paddi
      return profile ? profile : null;
    }
    return `User with ${username} not found`;
  };

  /**
   * Update a user profile
   *
   * @param {Object} user the current user
   * @param {Object} profile the profile data to save
   * @returns {Object} the updated profile
   * @memberof ProfileController
   */

  public editProfile = async (user: any, profile: IProfile) => {
    const hasProfile: boolean = (await user.getProfile()) ? true : false;
    if (hasProfile) {
      // update profile of a user by user_id
      let updated = await ProfileModel.update(profile, {
        where: { user_id: user.id },
      });
      if (updated) {
        // return user profile
        return await this.getUserProfile(user.username);
      }
      throw new AppError("Could not update user profile");
    } else {
      // create profile in profile model
      const saved = await ProfileModel.create(profile);
      if (saved && user.setProfile(saved)) {
        return await this.getUserProfile(user.username);
      }
      throw new AppError("Could not create user profile");
    }
  };

  /**
   * Used for get doctors progress
   *
   * @param {String} username of user
   * @memberof ProfileController
   */

  public getDoctorsProgress = async (username: any) => {
    // find user from user model by username
    const user = await UserModel.findOne({ where: { username } });
    let now_momemnt = moment();
    let NOW = new Date();
    const TODAY_DATE = now_momemnt.toDate();
    let TODAY_START = NOW;
    // find today_rate from account model by today start and end time
    let today_rate = await AccountModel.findOne({
      where: {
        online_time: {
          [Op.gt]: TODAY_START,
          [Op.lt]: TODAY_DATE,
        },
        userId: user.id,
      },
    });
    let compute = {
      hour_used: 0,
      percentage: "",
      amount_earned: 0,
      amount_percnt: "",
    };
    if (today_rate) {
      if (!today_rate.offline_time) {
        today_rate.offline_time = now_momemnt.toDate();
      }
      compute.hour_used = moment
        .duration(moment(today_rate.offline_time).diff(today_rate.online_time))
        .hours();
      compute.percentage = Math.round((today_rate.hour_used / 24) * 100) + "%";
      compute.amount_earned = today_rate.hour_used * 200;
      const total_amnt = 200 * 24;
      compute.amount_percnt =
        Math.round((compute.amount_earned / total_amnt) * 100) + "%";
    }
    const total_patients = await DB.query(
      `
        SELECT DISTINCT users.id from chats
          LEFT JOIN users ON users.id = user_id WHERE chats.sent_to = ${user.id}

          UNION

          SELECT DISTINCT users.id from chats
          LEFT JOIN users ON users.id = sent_to WHERE chats.user_id = ${user.id}`,
      {
        type: (<any>DB).QueryTypes.SELECT,
      }
    );
    return { today_rate, compute, total_patients: total_patients.length };
  };

  /**
   * Saves uploaded profile photo
   *
   * @param {Object} user the current user
   * @param {Object} photo the uploaded photo with properties
   * @returns {Object} the updated profile data
   * @memberof ProfileController
   */

  public saveProfilePhoto = async (user: any, photo: any) => {
    console.log(photo);
    const result = await cloudinary.uploader
      .upload(photo.path, { folder: "Profile" }, function (result) {
        return result;
      })
      .catch((error) => console.log(error));

    console.log(result);

    const profileData = {
      profile_picture_url: result.secure_url,
    };

    const hasProfile: boolean = (await user.getProfile()) ? true : false;

    if (hasProfile) {
      // update profile of user by user_id
      let updated = await ProfileModel.update(profileData, {
        where: { user_id: user.id },
      });
      if (updated) {
        return await this.getUserProfile(user.username);
      }
      throw new AppError("Could not update profile picture");
    } else {
      // create and save profile
      const saved = await ProfileModel.create(profileData);
      if (saved && user.setProfile(saved)) {
        return await this.getUserProfile(user.username);
      }
      throw new AppError("Could not update profile picture");
    }
  };
}
