# Example 1: Get object from private S3

In this example, we will build a function to get object from `S3 Bucket` which blocked all public accesses.

View the function in `src/services/aws-s3/getObject`.

> **Note**
>
> By the time, the content of these example files will change, but you just to understand the objective of this example.

## Re-prequisites

Ensure that you must complete the following requirements:

1. AWS Account.
2. A simple VPC with S3 accessible (S3 Gateway).
3. An EC2 Instance to run server.
4. An IAM Role which is attached to EC2 Instance.

## Environment setup

Later...

## Explain

- **Problem**: by default, **S3 Bucket** blocks all public access, that meant there is no one can access to get / upload files to **S3 Bucket**. First of all, how can users get file from that bucket?
- **Solution**: we need to create a server between Users and **S3 Bucket**. This server will take responsible to get files from **S3 Bucket** and forward the Data Stream to Users.

The following code will make a request to AWS API:

```js
/**
 * Get an object as with its `path`
 * @param {string} path
 */
function getObject(path) {
  const bucketName = process.env.BUCKET_NAME;
  /**
   * @type {GetObjectCommandInput}
   */
  // Create a input request, include
  // bucket name and key (name of file)
  const input = {
    Bucket: bucketName,
    Key: path,
  };
  const command = new GetObjectCommand(input);

  try {
    // Send the request to AWS APIs
    const response = s3Client.send(command);
    return response;
  } catch (error) {
    console.error("Get Object Error:", error);
    throw error;
  }
}
```

Process the response and forward the data stream to Users

```js
const getObject = require("src/services/aws-s3/getObject");

module.exports = {
  middlewares: [],
  handler: function (req, res, { ErrorUtils }) {
    return ErrorUtils.handleResponseError(this, res, async function () {
      const { key } = req.params;
      const response = await getObject(key);

      // Set header
      // Tell the browser that we will
      // send the `octet-stream` content
      res.setHeader(
        "Content-Type",
        response.ContentType || "application/octet-stream"
      );

      return response.Body.pipe(res);
    });
  },
};
```
