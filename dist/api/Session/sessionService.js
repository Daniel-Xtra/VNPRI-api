"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const moment_1 = __importDefault(require("moment"));
const _1 = require(".");
const app_error_1 = require("../../utils/app-error");
const User_1 = require("../User");
class SessionService {
    constructor() {
        /**
         * Get session status
         * @param {Object} user the current user
         * @param {Number} id
         * @returns sessionStatus on success
         * @memberof SessionController
         */
        this.getSessionStatus = async (user, id) => {
            // find session by current user_id and with_user
            const session = await _1.SessionModel.findOne({
                where: {
                    userId: user.id,
                    with_user: id,
                },
            });
            if (session) {
                return {
                    sessionStatus: session.session_state,
                };
            }
            throw new app_error_1.AppError("Not found", null, 404);
        };
        /**
         * Start session
         * @param {Object} user the current user
         * @param {Number} id
         * @param {String} type
         * @returns sessionStatus on success
         * @memberof SessionController
         */
        this.startSession = async (user, id, type) => {
            if (user.id == id) {
                throw new app_error_1.AppError("You cannot consult with yourself.");
            }
            // find session by current user_id and with_user
            const exSession = await _1.SessionModel.findOne({
                where: {
                    userId: user.id,
                    with_user: id,
                },
            });
            // responsible for get active session
            const sessions_count = await this.getActiveSessions(user.id);
            const subscription = await user.getSubscription();
            if (subscription && subscription.coin_balance < 500) {
                throw new app_error_1.AppError("You do not have enough coins to start a session.");
            }
            if (subscription.coin_balance < (sessions_count + 1) * 500) {
                // tslint:disable-next-line: max-line-length
                throw new app_error_1.AppError(`You don't have enough coins to start a session because you have ${sessions_count} active sessions.`);
            }
            if (exSession && exSession.session_state) {
                if (exSession.session_state == "active") {
                    throw new app_error_1.AppError(`You already have an active session with this ${type}`);
                }
                // responsible for update session_state and created_at by userId and with_user
                let updated = await _1.SessionModel.update({ session_state: "active", created_at: moment_1.default() }, {
                    where: {
                        userId: user.id,
                        with_user: id,
                    },
                });
                if (updated) {
                    return {
                        sessionStatus: "active",
                    };
                }
                throw new app_error_1.AppError("Could not start new session");
            }
            // responsible for create new session by with_user
            const session = await _1.SessionModel.create({ with_user: id });
            if (session && user.addSession(session)) {
                return {
                    sessionStatus: "active",
                };
            }
            throw new app_error_1.AppError("Could not start new session");
        };
        /**
         * End session
         * @param {Object} user the current user
         * @param {Number} id
         * @returns sessionStatus on success
         * @memberof SessionController
         */
        this.endSession = async (user, id) => {
            // find session owner by id
            const sessionOwner = await User_1.UserModel.findByPk(id);
            // find session by userId , with_user and session_state
            const session = await _1.SessionModel.findOne({
                where: {
                    userId: id,
                    with_user: user.id,
                    session_state: "active",
                },
            });
            if (session) {
                // update session_state by user_id and with_user of current user
                // responsible for get subscription
                let subscription = await sessionOwner.getSubscription();
                subscription = subscription.toJSON();
                subscription.coin_balance = subscription.coin_balance - 500;
                // responsible for update coin balance by user_id
                // Add session history
            }
            throw new app_error_1.AppError("You don't have an active session with this user.");
        };
        /**
         * Get active sessions
         * @param {Number} id
         * @returns {Number} on success
         * @memberof SessionController
         */
        this.getActiveSessions = async (id) => {
            // count active sessions by user_id and session_state
            return _1.SessionModel.count({
                where: {
                    userId: id,
                    session_state: "active",
                },
            });
        };
    }
}
exports.SessionService = SessionService;
//# sourceMappingURL=sessionService.js.map