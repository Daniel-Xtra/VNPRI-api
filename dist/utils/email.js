"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMailAfterRegister = exports.sendPasswordReset = void 0;
const app_error_1 = require("./app-error");
const nodemailer_1 = __importDefault(require("nodemailer"));
const index_1 = require("../config/index");
const sendMailGmail = async (body, to, subject) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: index_1.GMAIL_USERNAME,
            pass: index_1.GMAIL_PASSWORD, // generated ethereal password
        },
    });
    const recipients = to.toString();
    let mailOptions = {
        from: '"VNPRI" <noreply@vnrpi.com>',
        to: recipients,
        subject: subject ? subject : "New mail from vnpri",
        generateTextFromHTML: true,
        html: body,
    };
    let info = await transporter.sendMail(mailOptions);
    // if (info) {
    //     return info;
    // }
    return info;
};
const sendPasswordReset = async (code, user) => {
    const message = `<h3>Hi ${user.username},</h3>
        <p>Here's the password reset code you requested: <strong>${code}</strong></p>
        <p>If you believe you did this in error, please ignore this email.</p>`;
    let sentMail = await sendMailGmail(message, [user.email], "Password Reset Code");
    if (sentMail) {
        return "success";
    }
    throw new app_error_1.AppError("Could not send mail");
};
exports.sendPasswordReset = sendPasswordReset;
const sendMailAfterRegister = async (user) => {
    const message = `<h3>Hi ${user.username},</h3>
        <p>You have registered <strong>successfully</strong></p>
        <p>If you believe you did this in error, please ignore this email.</p>`;
    let sentMail = await sendMailGmail(message, [user.email], "Registered Successfully");
    if (sentMail) {
        return "success";
    }
    throw new app_error_1.AppError("Could not send mail");
};
exports.sendMailAfterRegister = sendMailAfterRegister;
//# sourceMappingURL=email.js.map