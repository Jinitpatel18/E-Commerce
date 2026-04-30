const errorMiddleware = (err, res, req, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    return res.status(statusCode).json({
        success: false,
        message
    })
}

export { errorMiddleware };