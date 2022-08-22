module.exports = function responseJson(res, statusCode, status, msg, data) {
    res.status(statusCode).json({
      status: status,
      msg: msg ?? '',
      data: data ?? []
    });
  }