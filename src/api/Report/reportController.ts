import { BaseController } from "../baseController";
import { IReport } from "./IReport";
import { ReportService } from "./reportService";

export class ReportController extends BaseController {
  private _report = new ReportService();

  public report = async (plate_number: string, user: any, data: IReport) => {
    const reported = await this._report.report(plate_number, user, data);
    return this.sendResponse(reported);
  };

  public allReport = async () => {
    const all = await this._report.getReport();
    return this.sendResponse(all);
  };

  public resolve = async (unique_id) => {
    const resolved = await this._report.resolve(unique_id);
    return this.sendResponse(resolved);
  };
}
