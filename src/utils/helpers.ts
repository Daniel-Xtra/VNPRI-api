import moment from "moment";

import nodeFs from "fs";
import bluebird from "bluebird";

const fs = bluebird.promisifyAll(nodeFs);

export const mkdirP = async (directory) => {
  try {
    return await fs.mkdirAsync(directory);
  } catch (error) {
    if (error.code != "EEXIST") {
      throw error;
    }
  }
};

/**
 * gets offset value
 * @param page
 * @param limit
 */

export const getOffsetValue = (page: number, limit: number) => {
  let offset: number = 0;
  if (page == 1) {
    return offset;
  } else if (page == 2) {
    return limit++;
  }
  let prev = page - 1;
  offset = prev * limit;
  return offset;
};

export const unAuthModifyPosts = async (posts: any, single?: boolean) => {
  // const follows = await user.getFollows();
  // check if membership_type is user then get the current user's sessions else find all sessions from session model by with_user
  // let sessions =
  //   user.membership_type == "user"
  //     ? await user.getSessions()
  //     : await SessionModel.findAll({ where: { with_user: user.id } });
  if (!single) {
    const modified: any = await Promise.all(
      posts.map(async (post) => {
        let postAsJson = post.toJSON();

        postAsJson.isUserFollowing = false;
        // check isBlocked or not
        postAsJson.isBlockedByUser = false;
        // check paddiListed or not
        postAsJson.isPaddiListed = false;
        postAsJson.user.sessionStatus = null;
        // check isSubActive or not
        postAsJson.user.isSubActive = false;
        return postAsJson;
      })
    );

    return modified;
  }

  let singlePost = posts.toJSON();

  singlePost.isUserFollowing = false;
  // check isBlocked by user or not
  singlePost.isBlockedByUser = false;
  // check isPaddiListed or not
  singlePost.isPaddiListed = false;

  return singlePost;
};

/**
 * get moment time difference
 * @param arr
 */

export const getMomentTimeDiff = async (arr: any) => {
  let datenow = new Date().getTime();
  let expires = new Date(arr);
  let time_diff = datenow - expires.getTime();
  let duration = await Math.round(time_diff / (1000 * 3600 * 24));
  return duration;
};

/**
 * has poll expired
 * @param expires
 */

export const hasPollExpired = (expires: Date): null | boolean => {
  if (!expires) {
    return null;
  }
  return moment().isAfter(expires) ? true : false;
};

/**
 * is subactive
 * @param expires
 */

export const isSubActive = (expires: Date): boolean => {
  return moment().isBefore(expires) ? true : false;
};

/**
 * coupon expired or not
 * @param expires
 */

export const hasCouponExpired = (expires: Date): boolean => {
  return moment().isBefore(expires) ? true : false;
};

/**
 * get user shadow balance
 * @param user
 */

/**
 * get moment time
 * @param arr
 */

export const getMomentTime = (arr: any[], currentExpire?: any) => {
  let now = moment();
  if (currentExpire) {
    let isSub = isSubActive(currentExpire);
    if (isSub) {
      let dateToUSe = moment(currentExpire);
      return dateToUSe.add(...arr).toDate();
    }
  }
  return now.add(...arr).toDate();
};
/**
 * WooCommerce
 */

/**
 * user excludes
 */

export const USER_EXCLUDES = [
  "email",
  "phone_number",
  "password",
  "first_name",
  "last_name",
  "date_of_birth",
  "email_verification_code",
  "reset_password_code",
  "refresh_token",
  "auth_key",
  "updated_at",
  "deleted_at",
];

/**
 * profile excludes
 */

export const PROFILE_EXCLUDES = [
  "relationship_status",
  "occupation",
  "highest_education",
  "current_education",
  "created_at",
  "updated_at",
  "deleted_at",
  "userId",
];

/**
 * user excludes for append data
 */

export const USER_EXCLUDES_FOR_APPENDDATA = [
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
];

export const USER_INCLUDES = [
  "id",
  "username",
  "email",
  "phone_number",
  "first_name",
  "last_name",
  "gender",
  "date_of_birth",
];
