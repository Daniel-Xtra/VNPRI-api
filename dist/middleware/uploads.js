"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.BlogImageUpload = exports.AlbumSongsUpload = exports.AlbumFileUpload = exports.BannerImageUpload = exports.ChatImageUpload = exports.ProfilePhotoUpload = exports.FrontendAssetsUpload = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const app_error_1 = require("../utils/app-error");
const helpers_1 = require("../utils/helpers");
// aws.config.update({
//   secretAccessKey: AWS_ACCESS_KEY,
//   accessKeyId: AWS_ACCESS_KEY_ID,
//   region: S3_REGION, // region of bucket
// });
const s3 = new aws_sdk_1.default.S3();
exports.FrontendAssetsUpload = multer_1.default({
    storage: multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            helpers_1.mkdirP("public");
            helpers_1.mkdirP("public/categories");
            cb(null, "./public/categories/");
        },
        filename: function (req, file, cb) {
            const fileName = file.fieldname;
            const fieldTime = Date.now();
            const originalName = file.originalname;
            const extension = originalName.slice(originalName.lastIndexOf("."));
            const newFileName = `${fileName}-${fieldTime}${extension}`;
            cb(null, newFileName);
        },
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            cb(null, true);
        }
        else {
        }
    },
});
exports.ProfilePhotoUpload = multer_1.default({
    storage: multer_s3_1.default({
        s3,
        bucket: "you",
        acl: "public-read",
        metadata(req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key(req, file, cb) {
            const fileName = Date.now();
            const originalName = file.originalname;
            const extension = originalName.slice(originalName.lastIndexOf("."));
            const newFileName = `profile_images/${fileName}${extension}`;
            cb(null, newFileName);
        },
    }),
});
exports.ChatImageUpload = multer_1.default({
    storage: multer_s3_1.default({
        s3,
        bucket: "you",
        acl: "public-read",
        metadata(req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key(req, file, cb) {
            const fileName = Date.now();
            const originalName = file.originalname;
            const extension = originalName.slice(originalName.lastIndexOf("."));
            const newFileName = `chat_media/${fileName}${extension}`;
            cb(null, newFileName);
        },
    }),
});
exports.BannerImageUpload = multer_1.default({
    storage: multer_s3_1.default({
        s3,
        bucket: "cloud",
        acl: "public-read",
        metadata(req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key(req, file, cb) {
            const fileName = Date.now();
            const originalName = file.originalname;
            const extension = originalName.slice(originalName.lastIndexOf("."));
            const newFileName = `banner_media/${fileName}${extension}`;
            cb(null, newFileName);
        },
    }),
});
// export const FrontendAssetsUpload = multer({
//   storage: multerS3({
//     s3,
//     bucket: "rtou",
//     acl: "public-read",
//     metadata(req, file, cb) {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key(req, file, cb) {
//       const fileName = Date.now();
//       const originalName = file.originalname;
//       const extension = originalName.slice(originalName.lastIndexOf("."));
//       const newFileName = `public_assets/${fileName}${extension}`;
//       cb(null, newFileName);
//     },
//   }),
// });
exports.AlbumFileUpload = multer_1.default({
    storage: multer_s3_1.default({
        s3,
        bucket: "sfj",
        acl: "public-read",
        metadata(req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key(req, file, cb) {
            const fileName = Date.now();
            const originalName = file.originalname;
            const extension = originalName.slice(originalName.lastIndexOf("."));
            const newFileName = `album_media/${fileName}${extension}`;
            cb(null, newFileName);
        },
    }),
    fileFilter: (req, file, cb) => {
        if (file.fieldname == "photo") {
            if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
                cb(null, true);
            }
            else {
                cb(null, false);
                throw new app_error_1.AppError("Photo must contain jpeg or png type file", null, 400);
            }
        }
        if (file.fieldname == "audio" && file.mimetype != "audio/mpeg") {
            cb(null, false);
            throw new app_error_1.AppError("Audio must contain mp3 file", null, 400);
        }
        cb(null, true);
    },
}).fields([
    { name: "photo", maxCount: 1 },
    { name: "audio", maxCount: 1 },
]);
exports.AlbumSongsUpload = multer_1.default({
    storage: multer_s3_1.default({
        s3,
        bucket: "jjf",
        acl: "public-read",
        metadata(req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key(req, file, cb) {
            const fileName = Date.now();
            const originalName = file.originalname;
            const extension = originalName.slice(originalName.lastIndexOf("."));
            const newFileName = `albm_songs_media/${fileName}${extension}`;
            cb(null, newFileName);
        },
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype != "audio/mpeg") {
            cb(null, false);
            throw new app_error_1.AppError("File must be mp3 file", null, 400);
        }
        cb(null, true);
    },
});
exports.BlogImageUpload = multer_1.default({
    storage: multer_s3_1.default({
        s3,
        bucket: "djd",
        acl: "public-read",
        metadata(req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key(req, file, cb) {
            const fileName = Date.now();
            const originalName = file.originalname;
            const extension = originalName.slice(originalName.lastIndexOf("."));
            const newFileName = `blog_media/${fileName}${extension}`;
            cb(null, newFileName);
        },
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            cb(null, true);
        }
        else {
            cb(null, false);
            throw new app_error_1.AppError("Photo must contain jpeg or png type file", null, 400);
        }
    },
});
const deleteFile = (key) => {
    return s3.deleteObject({
        Bucket: "fjdj",
        Key: key,
    }, function (err) {
        if (err) {
            console.log(err, err.stack);
        }
        else {
            console.log("Deleted Successfully");
        }
    });
};
exports.deleteFile = deleteFile;
//# sourceMappingURL=uploads.js.map