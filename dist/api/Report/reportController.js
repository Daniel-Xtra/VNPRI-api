"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const baseController_1 = require("../baseController");
const reportService_1 = require("./reportService");
class ReportController extends baseController_1.BaseController {
    constructor() {
        super(...arguments);
        this._report = new reportService_1.ReportService();
        this.report = async (plate_number, user, data) => {
            const reported = await this._report.report(plate_number, user, data);
            return this.sendResponse(reported);
        };
        this.allReport = async () => {
            const all = await this._report.getReport();
            return this.sendResponse(all);
        };
        this.resolve = async (unique_id) => {
            const resolved = await this._report.resolve(unique_id);
            return this.sendResponse(resolved);
        };
    }
}
exports.ReportController = ReportController;
//# sourceMappingURL=reportController.js.map