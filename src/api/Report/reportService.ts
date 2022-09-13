import crypto from "crypto";
import { AppError } from "../../utils/app-error";
import { PROFILE_EXCLUDES, USER_EXCLUDES } from "../../utils/helpers";
import { ProfileModel } from "../Profile";
import { IUser, UserModel } from "../User";

import { VehicleModel } from "../Vehicle";

import { IReport } from "./IReport";
import { ReportModel } from "./reportModel";

export class ReportService {
  public report = async (plate_number: string, user: IUser, data: IReport) => {
    const plate = await VehicleModel.findOne({ where: { plate_number } });
    if (plate) {
      data.unique_id = this.generateUniqueIdentifier();
      data.reporterId = user.id;
      data.vehicleId = plate.id;
      const saved = await ReportModel.create(data);

      if (saved) {
        const status = (plate.dataValues.status = "unauthorized");
        let updated = await VehicleModel.update(
          { status },
          { where: { id: plate.id } }
        );

        if (updated) {
          return ReportModel.findByPk(saved.id);
        }
        throw new AppError("could not update status of vehicle", null, 400);
      }

      throw new AppError("Could not save report", null, 400);
    }
    throw new AppError("Plate not found", null, 404);
  };

  public getReport = async () => {
    const all = await ReportModel.findAll({
      where: { status: "unresolved" },
      include: [
        {
          model: UserModel,
          as: "reporter",
          attributes: { exclude: USER_EXCLUDES },
          include: [
            {
              model: ProfileModel,
              required: true,
              attributes: {
                exclude: PROFILE_EXCLUDES,
              },
            },
          ],
        },
      ],
    });
    return all;
  };

  public resolve = async (unique_id) => {
    const repo = await ReportModel.findOne({ where: { unique_id } });
    if (repo) {
      const status = (repo.dataValues.status = "resolved");
      let updated = await ReportModel.update(
        { status },
        { where: { id: repo.id } }
      );
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
      throw new AppError("could not update report", null, 400);
    }

    throw new AppError("could not find report", null, 404);
  };

  private generateUniqueIdentifier() {
    return crypto.randomBytes(4).toString("hex");
  }
}
