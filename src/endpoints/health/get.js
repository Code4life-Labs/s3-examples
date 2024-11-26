module.exports = {
  middlewares: [],
  handler: async function (req, res, { ErrorUtils }) {
    return await ErrorUtils.handleJSONResponseError(
      this,
      res,
      function (response) {
        return response(200, { health: "Ok" }, "Server is health");
      }
    );
  },
};
