const { HTTPUtils } = require("./http");

const ErrorUtils = {
  /**
   * Use this function to wrap a function that can cause errors. The result of this function
   * is `Interchange` so it's suitable to use with some local components.
   * @param ctx
   * @param fn
   * @returns
   */
  async handleInterchangeError(ctx, fn) {
    let result = HTTPUtils.generateInterchange(0);

    try {
      let maybePromisedData = fn.call(
        ctx,
        result,
        HTTPUtils.generateInterchange
      );
      // If function is an async function
      if (maybePromisedData instanceof Promise)
        result = await maybePromisedData;
      else result = maybePromisedData;
    } catch (error) {
      result.code = 1;
      result.message = error.message;
    } finally {
      return result;
    }
  },

  /**
   * Use this function to wrap a function that can cause errors. The result of this function
   * is `HTTPResponse` so it's suitable to use with controller's handlers.
   * @param ctx
   * @param fn
   * @returns
   */
  async handleJSONResponseError(ctx, res, fn) {
    let result;
    try {
      result = await fn.call(ctx, HTTPUtils.generateHTTPResponseData);
    } catch (error) {
      let code = result.code === 200 ? 500 : result.code;
      result = HTTPUtils.generateHTTPResponseData(
        code,
        undefined,
        error.message
      );
    } finally {
      if (result) return res.status(result.code).json(result);
    }
  },

  /**
   * Use this function to handle error in streamming response, if there
   * is any error, return JSON Response.
   * @param ctx
   * @param res
   * @param fn
   * @returns
   */
  async handleResponseError(ctx, res, fn) {
    try {
      await fn.call(ctx);
    } catch (error) {
      const result = HTTPUtils.generateHTTPResponseData(
        404,
        null,
        "File not found"
      );
      return res.status(result.code).json(result);
    }
  },
};

module.exports = { ErrorUtils };
