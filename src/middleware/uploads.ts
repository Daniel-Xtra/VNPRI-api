import aws from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import { AppError } from "../utils/app-error";

import { mkdirP } from "../utils/helpers";

// aws.config.update({
//   secretAccessKey: AWS_ACCESS_KEY,
//   accessKeyId: AWS_ACCESS_KEY_ID,
//   region: S3_REGION, // region of bucket
// });

const s3 = new aws.S3();

export const FrontendAssetsUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      mkdirP("public");
      mkdirP("public/categories");
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
    } else {
    }
  },
});

export const ProfilePhotoUpload = multer({
  storage: multerS3({
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

export const ChatImageUpload = multer({
  storage: multerS3({
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

export const BannerImageUpload = multer({
  storage: multerS3({
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

export const AlbumFileUpload = multer({
  storage: multerS3({
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
      } else {
        cb(null, false);
        throw new AppError(
          "Photo must contain jpeg or png type file",
          null,
          400
        );
      }
    }
    if (file.fieldname == "audio" && file.mimetype != "audio/mpeg") {
      cb(null, false);
      throw new AppError("Audio must contain mp3 file", null, 400);
    }
    cb(null, true);
  },
}).fields([
  { name: "photo", maxCount: 1 },
  { name: "audio", maxCount: 1 },
]);

export const AlbumSongsUpload = multer({
  storage: multerS3({
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
      throw new AppError("File must be mp3 file", null, 400);
    }
    cb(null, true);
  },
});

export const BlogImageUpload = multer({
  storage: multerS3({
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
    } else {
      cb(null, false);
      throw new AppError("Photo must contain jpeg or png type file", null, 400);
    }
  },
});

export const deleteFile = (key) => {
  return s3.deleteObject(
    {
      Bucket: "fjdj",
      Key: key,
    },
    function (err) {
      if (err) {
        console.log(err, err.stack);
      } else {
        console.log("Deleted Successfully");
      }
    }
  );
};
