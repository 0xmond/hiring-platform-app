import multer, { diskStorage } from "multer";

export const fileFormats = {
  images: ["image/png", "image/jpeg"],
  docs: ["application/pdf", "application/msword"],
};

export const uploadFile = (acceptedFormat) => {
  try {
    const storage = diskStorage({}); // stores files in temp folder in operating system

    const fileFilter = (req, file, cb) => {
      if (!acceptedFormat.includes(file.mimetype))
        return cb(new Error("Format not allowed", { cause: 400 }), false);

      return cb(null, true);
    };
    return multer({ storage, fileFilter });
  } catch (error) {
    return next(new Error(error.message, { cause: 500 }));
  }
};
