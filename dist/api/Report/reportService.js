"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const app_error_1 = require("../../utils/app-error");
const helpers_1 = require("../../utils/helpers");
const Profile_1 = require("../Profile");
const User_1 = require("../User");
const Vehicle_1 = require("../Vehicle");
const reportModel_1 = require("./reportModel");
class ReportService {
    constructor() {
        this.report = async (plate_number, user, data) => {
            const plate = await Vehicle_1.VehicleModel.findOne({ where: { plate_number } });
            if (plate) {
                data.unique_id = this.generateUniqueIdentifier();
                data.reporterId = user.id;
                data.vehicleId = plate.id;
                const saved = await reportModel_1.ReportModel.create(data);
                if (saved) {
                    const status = (plate.dataValues.status = "unauthorized");
                    let updated = await Vehicle_1.VehicleModel.update({ status }, { where: { id: plate.id } });
                    if (updated) {
                        return reportModel_1.ReportModel.findByPk(saved.id);
                    }
                    throw new app_error_1.AppError("could not update status of vehicle", null, 400);
                }
                throw new app_error_1.AppError("Could not save report", null, 400);
            }
            throw new app_error_1.AppError("Plate not found", null, 404);
        };
        this.getReport = async () => {
            const all = await reportModel_1.ReportModel.findAll({
                where: { status: "unresolved" },
                include: [
                    {
                        model: User_1.UserModel,
                        as: "reporter",
                        attributes: { exclude: helpers_1.USER_EXCLUDES },
                        include: [
                            {
                                model: Profile_1.ProfileModel,
                                required: true,
                                attributes: {
                                    exclude: helpers_1.PROFILE_EXCLUDES,
                                },
                            },
                        ],
                    },
                ],
            });
            return all;
        };
        this.resolve = async (unique_id) => {
            const repo = await reportModel_1.ReportModel.findOne({ where: { unique_id } });
            if (repo) {
                const status = (repo.dataValues.status = "resolved");
                let updated = await reportModel_1.ReportModel.update({ status }, { where: { id: repo.id } });
                if (updated) {
                    // const check = await ReportModel.findAll({
                    //   where: { vehicle_id: repo.vehicleId },
                    // });
                    // if (check) {
                    //   check.forEach((element) => {
                    //     console.log(element.status);
                    //     if (element?.status === "unresolved") {
                    //       return "updated report only";
                    //     } else {
                    //       const veh = VehicleModel.update(
                    //         { status: "authorized" },
                    //         { where: { id: repo.vehicleId } }
                    //       );
                    //       if (veh) return "updated successfully";
                    //       throw new AppError("could not update vehicle", null, 400);
                    //     }
                    //   });
                    // }
                    return "resolved successfully";
                }
                throw new app_error_1.AppError("could not update report", null, 400);
            }
            throw new app_error_1.AppError("could not find report", null, 404);
        };
    }
    generateUniqueIdentifier() {
        return crypto_1.default.randomBytes(4).toString("hex");
    }
}
exports.ReportService = ReportService;
//# sourceMappingURL=reportService.js.map