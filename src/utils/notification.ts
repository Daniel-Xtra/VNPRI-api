import {
  NotificationService,
  INotification,
  sendPush,
} from "../api/Notification";
import {
  IPushData,
  ISettings,
  IPostPushData,
} from "../api/Notification/INotification";
import { UserModel, SettingModel } from "../api/User";
import * as contexts from "../utils/notification-contexts";
import { Op } from "sequelize";
import { sendPostPush } from "../api/Notification/push";

export class Notification {
  private _notificationService = new NotificationService();

  /**
   * send Notification
   */
  public sendNotification = async (
    message: string,
    context: string,
    createLocal: boolean,
    extraData: any,
    userId: number,
    targetId: number,
    isFromApp: boolean = true
  ) => {
    if (createLocal == true) {
      await this.createLocal(userId, targetId, message, context, extraData);
    }

    const target = await UserModel.findByPk(targetId);
    if (!target || target.player_id == null || userId == targetId) {
      return null;
    }
    const user = await UserModel.findByPk(userId);
    if (!user && isFromApp == true) {
      return null;
    }

    let settings = await target.getSettings();
    if (!settings) {
      const saved = await SettingModel.create();
      if (saved && (await target.setSettings(saved))) {
        settings = await target.getSettings();
      }
    }

    const settingsJSON: ISettings = settings.toJSON();

    if (settingsJSON.hasOwnProperty(context) || isFromApp == false) {
      const settingValue = settingsJSON[context];
      const player_id = target.player_id;

      const canSendPush: boolean =
        (settingValue == true && player_id != null) || isFromApp == false
          ? true
          : false;

      if (canSendPush) {
        const heading =
          context == contexts.DIRECT_MESSAGE
            ? "New direct message"
            : "New notification";

        const notification: IPushData = {
          contents: {
            en: !user ? `${message}` : `${user.username} ${message}`,
          },
          data: {
            context,
            extraData,
          },
          headings: {
            en: heading,
          },
          include_player_ids: [target.player_id],
          subtitle: {
            en: "Tap to view",
          },
        };
        return sendPush(notification);
      }
    }
  };
  public sendPostNotification = async (
    message: string,
    context: string,
    extraData: any,
    user: any,
    per_page: number = 2000
  ) => {
    // let per_page: number = 2000;
    let playerReslt = await this.getPlayerIds(user, per_page);
    let totalDbCount = playerReslt.totalDbCount;

    if (playerReslt.canSendPush && playerReslt.player_ids.length > 0) {
      const heading =
        context == contexts.NEW_POST ? "New post created" : "New notification";

      const notification: IPostPushData = {
        contents: {
          en: !user ? `${message}` : `${user.username} ${message}`,
        },
        include_player_ids: playerReslt.player_ids,
        data: {
          context,
          extraData,
        },
        headings: {
          en: heading,
        },
        // include_player_ids: player_ids,
        // included_segments: ["Active Users"],
        subtitle: {
          en: "Tap to view",
        },
      };
      per_page += playerReslt.player_ids.length;

      sendPostPush(notification);
      if (per_page < totalDbCount) {
        this.sendPostNotification(message, context, extraData, user, per_page);
      }
      return {
        status: true,
        data: extraData,
      };
    }
    return {
      status: true,
      data: extraData,
    };
  };
  private getPlayerIds = async (user: any, per_page: number) => {
    let all_id = [];
    const limit: number = 2000;
    const offset: number = per_page - limit;
    let totalDbCount: number;
    let target_id = await SettingModel.findAll({
      limit,
      offset,
      attributes: {
        include: ["settingId"],
      },
      where: {
        [Op.and]: [
          {
            settingId: {
              [Op.ne]: user.id,
            },
          },
          {
            post: 1,
          },
        ],
      },
    });

    totalDbCount = await SettingModel.count({
      where: {
        [Op.and]: [
          {
            settingId: {
              [Op.ne]: user.id,
            },
          },
          {
            post: 1,
          },
        ],
      },
    });

    if (target_id) {
      target_id.forEach((element) => {
        all_id.push(element.settingId);
      });
      const target = await UserModel.findAll({
        attributes: ["player_id"],
        where: {
          [Op.and]: [
            {
              id: all_id,
            },
            {
              player_id: {
                [Op.ne]: null,
              },
            },
          ],
        },
      });
      if (!target) {
        return null;
      }
      let player_ids = [];
      target.forEach((element) => {
        player_ids.push(element.player_id);
      });
      const canSendPush: boolean = target ? true : false;
      return { player_ids, canSendPush, totalDbCount };
    }
  };
  /**
   * create
   */
  // tslint:disable-next-line:max-line-length
  private createLocal = async (
    user: number,
    resourceOwner: number,
    message: string,
    context: string,
    extraData: any
  ) => {
    if (user == resourceOwner) {
      return null;
    }
    const notification: INotification = {
      message,
      context,
      triggered_by: user,
      extra_data: JSON.stringify(extraData),
    };
    const saved = await this._notificationService.createNotification(
      resourceOwner,
      notification
    );
    if (!saved) {
      return null;
    }
    return true;
  };
}
