const HTTPUtils = {
  Methods: {
    get: "get",
    post: "post",
    put: "put",
    delete: "delete",
    patch: "patch",
  },
  StatusCodes: {
    100: {
      title: "Continue",
    },
    101: {
      title: "Switching Protocols",
    },
    102: {
      title: "Processing",
    },
    103: {
      title: "Early Hints",
    },
    200: {
      title: "OK",
    },
    201: {
      title: "Created",
    },
    202: {
      title: "Accepted",
    },
    203: {
      title: "Non-Authoritative Information",
    },
    204: {
      title: "No Content",
    },
    205: {
      title: "Reset Content",
    },
    206: {
      title: "Partial Content",
    },
    207: {
      title: "Multi-Status",
    },
    208: {
      title: "Already Reported",
    },
    226: {
      title: "IM Used",
    },
    300: {
      title: "Multiple Choices",
    },
    301: {
      title: "Moved Permanently",
    },
    302: {
      title: "Found",
    },
    303: {
      title: "See Other",
    },
    304: {
      title: "Not Modified",
    },
    305: {
      title: "Use Proxy",
    },
    306: {
      title: "Unused",
    },
    307: {
      title: "Temporary Redirect",
    },
    308: {
      title: "Permanent Redirect",
    },
    400: {
      title: "Bad Request",
    },
    401: {
      title: "Unauthorized",
    },
    402: {
      title: "Payment Required",
    },
    403: {
      title: "Forbidden",
    },
    404: {
      title: "Not Found",
    },
    405: {
      title: "Method Not Allowed",
    },
    406: {
      title: "Not Acceptable",
    },
    407: {
      title: "Proxy Authentication Required",
    },
    408: {
      title: "Request Timeout",
    },
    409: {
      title: "Conflict",
    },
    410: {
      title: "Gone",
    },
    411: {
      title: "Length Required",
    },
    412: {
      title: "Prediction Failed",
    },
    413: {
      title: "Payload Too Large",
    },
    414: {
      title: "URI Too Long",
    },
    415: {
      title: "Unsupported Media Type",
    },
    429: {
      title: "Too Many Request",
    },
    500: {
      title: "Internal Server Error",
    },
  },

  /**
   * Use to check if `method` is a valid HTTP Method name
   * @param {string} method
   * @returns
   */
  isValidHTTPMethod(method) {
    return Boolean(HTTPUtils.Methods[method]);
  },

  /**
   * Use this method to create a HTTP Data to response to client
   * @param code
   * @param data
   * @param message
   * @returns
   */
  generateHTTPResponseData(code, data, message) {
    if (!Boolean(HTTPUtils.StatusCodes[code]))
      throw new Error(`[${code}] isn't a valid HTTP Code`);

    let responseObject = {
      data: data ? data : null,
      error: null,
      success: null,
      message,
      code: code ? code : 200,
    };

    if (code >= 100 && code < 400) {
      responseObject.success = HTTPUtils.StatusCodes[code];
    }

    if ((code >= 400 && code < 500) || (code >= 500 && code < 600)) {
      responseObject.error = HTTPUtils.StatusCodes[code];
    }

    return responseObject;
  },

  /**
   * Use this method to create an object for interchange data
   * @param code
   * @param message
   * @param data
   * @returns
   */
  generateInterchange(code, message, data) {
    return {
      code: code ? code : 0,
      message: message ? message : null,
      data: data ? data : null,
    };
  },
};

module.exports = { HTTPUtils };
