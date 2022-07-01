"use strict";
// import { AppError } from "../../utils/app-error";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioService = void 0;
const app_error_1 = require("../../utils/app-error");
var accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
var authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token from www.twilio.com/console
const client = require("twilio")(accountSid, authToken, {
    lazyLoading: true,
});
class TwilioService {
    constructor() {
        this.sendMessage = async (message, senderID) => {
            try {
                await client.messages.create({
                    to: senderID,
                    body: message,
                    from: "whatsapp:+14155238886",
                });
            }
            catch (error) {
                console.log(`Error at whatsapp ---> ${error.message}`);
            }
        };
        this.message = async (Body, From) => {
            // if (body.Body == "hello") {
            //   await this.WA("Your said hello", senderID);
            //   console.log("hello");
            // } else if (body.Body == "yes") {
            //   await this.WA("Your said yes", senderID);
            // } else {
            //   await this.WA("hello from here also", senderID);
            // }
            switch (Body) {
                case "Hi":
                    this.sendMessage("What can i do for you", From);
                    console.log(Body);
                    break;
                case "Complain":
                    this.sendMessage("Let`s know what bothering you", From);
                    break;
                case "Enquiry":
                    this.sendMessage("What are you ready to know", From);
                    break;
                case "know my name":
                    this.sendMessage("What is your name", From);
                    break;
                default:
                    throw new app_error_1.AppError("Unknown Transaction Channel", null, 400);
            }
        };
    }
}
exports.TwilioService = TwilioService;
//# sourceMappingURL=twilioService.js.map