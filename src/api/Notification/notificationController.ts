import { BaseController } from '../baseController';
import { NotificationService } from './notificationService';
import { ISettings } from '.';
import { IUser } from '../User';

/**
 * Notification controller
 *
 * @export
 * @class NotificationController
 */
export class NotificationController extends BaseController {
  private _notificationService = new NotificationService();

  public index = () => {
    return this.sendResponse('notifications');
  };

  /**
   * This function is used for get user notifications
   * @param user
   */

  public getUserNotifications = async (user: IUser) => {
    // responsible for get user notifications
    const notifications = await this._notificationService.getUserNotifications(
      user
    );
    return this.sendResponse(notifications);
  };

  /**
   * This function is used for mark all notification as read
   * @param user
   */

  public readAll = async (user: IUser) => {
    // responsible for mark all notifications as read
    const updated = await this._notificationService.markAllNotificationsAsRead(
      user
    );
    return this.sendResponse(updated);
  };

  /**
   * This function is used for mark one notification as read
   * @param user
   * @param id
   */

  public readOne = async (user: IUser, id: number) => {
    // responsible for mark one notification as read
    const updated = await this._notificationService.markOneNotificationAsRead(
      user,
      id
    );
    return this.sendResponse(updated);
  };
  /**
   * This function is used for get notification settings
   * @param user
   */

  public getSettings = async (user: IUser) => {
    // responsible for get notification settings
    const settings = await this._notificationService.getNotificationSettings(
      user
    );
    return this.sendResponse(settings);
  };

  /**
   * This function is used for update settings
   * @param user
   * @param data
   */

  public updateSettings = async (user: IUser, data: ISettings) => {
    // responsible for save notification settings
    const settings = await this._notificationService.saveNotificationSettings(
      user,
      data
    );
    return this.sendResponse(settings);
  };
  /**
   * This function is used for save device
   * @param user
   * @param data
   */

  public saveDevice = async (user: IUser, data: any) => {
    // responsible for save device
    const updated = await this._notificationService.saveDevice(
      user,
      data.token
    );
    return this.sendResponse(updated);
  };
}
