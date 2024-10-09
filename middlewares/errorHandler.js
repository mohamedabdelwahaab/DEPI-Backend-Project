const notFound = (req, res, next) => {
    const err = new Error(`Not Found ${req.originalUrl}`);
    err.status = 404;
    next(err);
}
const errorHandler = (err, req, res, next) => {
    const status = err.status || 500; // Use the error's status if available
    res.status(status).json({ message: err.message });
}

module.exports = {
    notFound,
    errorHandler,
}