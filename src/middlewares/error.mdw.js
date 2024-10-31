export default function(err, req, res, next) {
    console.error(err);
    res.status(err.status || 500).json({
        code: err.code || 'internal_server_error',
        message: err.message || 'Internal Server Error',
    });
}