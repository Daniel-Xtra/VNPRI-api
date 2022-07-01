"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionController = void 0;
const baseController_1 = require("../baseController");
const sessionService_1 = require("./sessionService");
/**
 * Session controller
 *
 * @export
 * @class SessionController
 */
class SessionController extends baseController_1.BaseController {
    constructor() {
        super(...arguments);
        this._sessionService = new sessionService_1.SessionService();
        this.index = () => {
            return this.sendResponse("Session");
        };
        /**
         * This function is used for get session status
         * @param user
         * @param id
         */
        this.getSessionStatus = async (user, id) => {
            const status = await this._sessionService.getSessionStatus(user, id);
            return this.sendResponse(status);
        };
        /**
         * This function is used for start session
         * @param user
         * @param id
         * @param data
         */
        this.startSession = async (user, id, data) => {
            let type = data && data.type ? data.type : "doctor";
            const session = await this._sessionService.startSession(user, id, type);
            return this.sendResponse(session);
        };
        /**
         * This function is used for end session
         * @param user
         * @param id
         */
        this.endSession = async (user, id) => {
            const session = await this._sessionService.endSession(user, id);
            return this.sendResponse(session);
        };
    }
}
exports.SessionController = SessionController;
//# sourceMappingURL=sessionController.js.map