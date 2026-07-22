const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

const useCloudinary = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_KEY !== 'your_api_key';

let storage;

if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      const isDoc = file.mimetype === 'application/pdf' || file.mimetype.includes('document');
      return {
        folder: isDoc ? 'tarun-builders/documents' : 'tarun-builders/media',
        allowed_formats: isDoc ? ['pdf', 'doc', 'docx'] : ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4'],
        resource_type: isDoc ? 'raw' : 'auto',
        transformation: isDoc ? [] : [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }],
        public_id: `${Date.now()}-${file.originalname.split('.')[0].replace(/\s+/g, '-')}`,
      };
    },
  });
} else {
  // Ensure local uploads directory exists
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext).replace(/\s+/g, '-');
      cb(null, `${Date.now()}-${basename}${ext}`);
    }
  });
}

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif|mp4|pdf|doc|docx/;
  if (allowed.test(file.mimetype) || allowed.test(file.originalname.split('.').pop())) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed'), false);
  }
};

const baseUpload = multer({ storage, fileFilter, limits: { fileSize: 20 * 1024 * 1024 } });

// Custom wrapper to override path to public URL path when local storage is used
const uploadWrapper = {
  single: (fieldName) => {
    const middleware = baseUpload.single(fieldName);
    return (req, res, next) => {
      middleware(req, res, (err) => {
        if (err) return next(err);
        if (req.file && !useCloudinary) {
          // Rewrite file.path to be accessible via /uploads static route
          req.file.path = `http://localhost:5001/uploads/${req.file.filename}`;
        }
        next();
      });
    };
  },
  array: (fieldName, maxCount) => {
    const middleware = baseUpload.array(fieldName, maxCount);
    return (req, res, next) => {
      middleware(req, res, (err) => {
        if (err) return next(err);
        if (req.files && !useCloudinary) {
          req.files.forEach(file => {
            file.path = `http://localhost:5001/uploads/${file.filename}`;
          });
        }
        next();
      });
    };
  }
};

module.exports = uploadWrapper;
