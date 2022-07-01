"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
class BaseController {
    sendResponse(data, message = "OK", statusCode = 200, status = true) {
        return { data, message, statusCode, status };
    }
}
exports.BaseController = BaseController;
//# sourceMappingURL=baseController.js.map