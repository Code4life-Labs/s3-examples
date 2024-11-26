const {
  GetObjectCommand,
  GetObjectCommandInput,
} = require("@aws-sdk/client-s3");

// Import

// Import internal configuration
const { s3Client } = require("./__config__");

/**
 * Get an object as with its `path`
 * @param {string} path
 */
function getObject(path) {
  const bucketName = process.env.BUCKET_NAME;
  /**
   * @type {GetObjectCommandInput}
   */
  const input = {
    Bucket: bucketName,
    Key: path,
  };
  const command = new GetObjectCommand(input);

  try {
    const response = s3Client.send(command);
    return response;
  } catch (error) {
    console.error("Get Object Error:", error);
    throw error;
  }
}

module.exports = getObject;
