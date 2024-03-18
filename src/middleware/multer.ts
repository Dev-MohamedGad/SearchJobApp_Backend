import multer, { DiskStorageOptions } from "multer";
import { fileURLToPath } from "url";
import { Request } from "express";

const __dirname = fileURLToPath(import.meta.url);

export const filteration = {
  image: ["image/png", "image/jpeg", "image/gif"],
  file: ["application/pdf", "application/msword"],
};

export const uploadFile = (filter: string[]) => {
  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    if (filter.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file format"), false);
    }
  };

  const upload = multer({ storage, fileFilter: fileFilter });
  return upload;
};
