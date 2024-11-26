const getObject = require("src/services/aws-s3/getObject");

module.exports = {
  middlewares: [],
  handler: function (req, res, { ErrorUtils }) {
    return ErrorUtils.handleResponseError(this, res, async function () {
      const { key } = req.params;
      const response = await getObject(key);

      // Set header
      res.setHeader(
        "Content-Type",
        response.ContentType || "application/octet-stream"
      );

      return response.Body.pipe(res);
    });
  },
};
