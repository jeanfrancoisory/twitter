const multer = require("multer");

const storageProfil = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/PP')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + req.params.userName)
    }
  })

const storageTweet = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/PT')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + req.params.tweetID)
    }
  })

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false); 
    }
};

const upload = multer({
    storage: storageProfil,
    fileFilter: fileFilter
});

const uploadTweet = multer({
  storage: storageTweet,
  fileFilter: fileFilter
});

exports.upload = upload;
exports.uploadTweet = uploadTweet;