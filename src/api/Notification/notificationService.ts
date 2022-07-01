import { NotificationModel, INotification, ISettings } from ".";
import { AppError } from "../../utils/app-error";
import { UserModel, SettingModel, IUser } from "../User";
import { ProfileModel } from "../Profile";
import {
  PROFILE_EXCLUDES,
  USER_EXCLUDES_FOR_APPENDDATA,
} from "../../utils/helpers";
export class NotificationService {
  /**
   * Creates new notification for user
   * @param {Object} user the current user
   * @param {Object} notification the notification data
   * @returns {(string|null)} the notification success message
   * @memberof NotificationController
   */

  public createNotification = async (
    userId: number,
    notification: INotification
  ) => {
    // check if notification context and message both have or not
    if (!notification.context || !notification.message) {
      throw new AppError("Notification data incomplete");
    }

    // find user from user model by userId
    const user = await UserModel.findByPk(userId);
    if (!user) {
      throw new AppError("Cannot find user");
    }

    // create notification
    const saved = await NotificationModel.create(notification);
    if (saved && user.addNotification(saved)) {
      return "notification saved";
    }
    throw new AppError("Could not create notification");
  };

  /**
   * Gets all user's notifications
   * @param {Object} user the current user
   * @returns notifications
   * @memberof NotificationController
   */

  public getUserNotifications = async (user: any) => {
    // append the notifications
    const notifications = await this.appendData(user);
    if (notifications) {
      // count total unread notifications of current user by user_id
      const totalUnreads = await NotificationModel.count({
        where: { is_read: false, user_id: user.id },
      });
      return {
        notifications,
        unreads: totalUnreads,
      };
    }
    throw new AppError("No notifications.", null, 404);
  };

  /**
   * Mark all notifications as read
   * @param {Object} user the current user
   * @returns notifications
   * @memberof NotificationController
   */

  public markAllNotificationsAsRead = async (user: any) => {
    const data = {
      is_read: true,
    };
    // update the current user's read statement by user_id
    const updated = await NotificationModel.update(data, {
      where: { user_id: user.id },
    });
    if (updated) {
      // get current user's notifications
      const notifications = await this.appendData(user);
      // count total unread notifications of current user by userId
      const totalUnreads = await NotificationModel.count({
        where: { is_read: false, user_id: user.id },
      });
      return {
        notifications,
        unreads: totalUnreads,
      };
    }

    throw new AppError("No unread notifications", null, 400);
  };

  /**
   * Gets all notification as read
   * @param {Object} user the current user
   * @param {String} id notification id
   * @returns notifications
   * @memberof NotificationController
   */

  public markOneNotificationAsRead = async (user: any, id: number) => {
    const data = {
      is_read: true,
    };
    // update the current user's read statement by user_id
    const updated = await NotificationModel.update(data, {
      where: {
        id,
      },
    });
    if (updated) {
      // get current user's notifications
      const notifications = await this.appendData(user);
      // count total unread notifications of the current user by user_id
      const totalUnreads = await NotificationModel.count({
        where: { is_read: false, user_id: user.id },
      });
      return {
        notifications,
        unreads: totalUnreads,
      };
    }
  };

  /**
   * Get notification settings
   * @param {Object} user the current user
   * @returns notification settings
   * @memberof NotificationController
   */

  public getNotificationSettings = async (user: any) => {
    // get current user's notification settings
    let settings = await user.getSettings();
    if (!settings) {
      // create notification settings
      const saved = await SettingModel.create();
      await user.setSettings(saved);
      settings = await user.getSettings();
    }

    let settingsJSON: ISettings = settings.toJSON();

    return settingsJSON;
  };

  /**
   * Save notification settings
   * @param {Object} user the current user
   * @param {Object} settings ISettings
   * @returns updated
   * @memberof NotificationController
   */

  public saveNotificationSettings = async (
    user: IUser,
    settings: ISettings
  ) => {
    // update current user's settings by user_id
    const updated = await SettingModel.update(settings, {
      where: { settingId: user.id },
    });

    if (!updated) {
      throw new AppError("Unable to update notification settings.");
    }
    return await this.getNotificationSettings(user);
  };

  /**
   * Save device
   * @param {Object} user the current user
   * @param {String} token
   * @returns {String} on success
   * @memberof NotificationController
   */

  public saveDevice = async (user: IUser, token: string) => {
    // update player_id of current user by user_id
    const saved = await UserModel.update(
      { player_id: token },
      {
        where: { id: user.id },
      }
    );

    if (!saved) {
      throw new AppError("Could not save device token");
    }

    return "Saved token";
  };

  /**
   * Append data
   * @param user
   * @returns notifications on success
   * @memberof NotificationController
   */

  private appendData = async (user: any) => {
    // find all notifications by user id
    const allNotification = await NotificationModel.findAll({
      where: {
        user_id: user.id,
      },
      order: [["created_at", "desc"]],
      include: [
        {
          model: UserModel,
          as: "user",
          attributes: {
            exclude: USER_EXCLUDES_FOR_APPENDDATA,
          },
          include: [
            {
              model: ProfileModel,
              attributes: {
                exclude: PROFILE_EXCLUDES,
              },
            },
          ],
        },
      ],
    });

    if (!allNotification) {
      throw new AppError("No notifications.", null, 404);
    }

    return JSON.parse(JSON.stringify(allNotification));
  };
}
