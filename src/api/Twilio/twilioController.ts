import { BaseController } from "../baseController";
import { TwilioService } from "./twilioService";

export class TwilioController extends BaseController {
  private _twilioService = new TwilioService();

  public chat = async (Body, From) => {
    const start = await this._twilioService.message(Body, From);
    return this.sendResponse(start);
  };
}
