import multer from 'multer';
import multerS3 from 'multer-s3';
import { s3 } from '../config/aws';

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.match(/jpe|jpeg|png|gif$i/)) {
    cb(new Error('File is not supported'), false);
    return;
  }
  cb(null, true);
};

export const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    metadata(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key(req, file, cb) {
      cb(
        null,
        `images/${new Date().toISOString().replace(/:/g, '-')}${
          file.originalname
        }`,
      );
    },
  }),
  fileFilter,
});

export default { upload };
