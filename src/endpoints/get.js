module.exports = {
  middlewares: [],
  handler: async function (req, res, { ErrorUtils }) {
    return await ErrorUtils.handleJSONResponseError(
      this,
      res,
      function (response) {
        return response(200, "Welcome to S3 Examples Server", "Successfully");
      }
    );
  },
};
