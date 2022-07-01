"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioController = void 0;
const baseController_1 = require("../baseController");
const twilioService_1 = require("./twilioService");
class TwilioController extends baseController_1.BaseController {
    constructor() {
        super(...arguments);
        this._twilioService = new twilioService_1.TwilioService();
        this.chat = async (Body, From) => {
            const start = await this._twilioService.message(Body, From);
            return this.sendResponse(start);
        };
    }
}
exports.TwilioController = TwilioController;
//# sourceMappingURL=twilioController.js.map