const successResponse = (res, statusCode, message, data) => {
    const result = {
        status: true,
        status_code: statusCode || 200,
        message,
        data
    };

    res.status(statusCode).json(result);
}

const errorResponse = (res, statusCode, message) => {
    const result = {
        status: false,
        status_code: statusCode || 500,
        message,
        data: {}
    };

    res.status(statusCode).json(result);
}

module.exports = {
    successResponse,
    errorResponse
}