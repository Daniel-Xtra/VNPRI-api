"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary = require("cloudinary").v2;
const index_1 = require("../config/index");
cloudinary.config({
    cloud_name: index_1.CLOUD_NAME,
    api_key: index_1.API_KEY,
    api_secret: index_1.API_SECRET,
});
module.exports = { cloudinary };
//# sourceMappingURL=cloudinary.js.map