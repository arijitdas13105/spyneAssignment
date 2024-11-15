const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dl350ragv',
  api_key: '719167477853155',
  api_secret: 'G4b99RCkjkYiCKF36Yqek7VYo_w',
});

module.exports = cloudinary;
