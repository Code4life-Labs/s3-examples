const { S3Client } = require("@aws-sdk/client-s3");

// S3 Client will be setup here
const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

module.exports = {
  s3Client,
};
