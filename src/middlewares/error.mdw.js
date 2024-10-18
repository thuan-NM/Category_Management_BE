export default function(err, req, res, next) {
    return res.fly({ status: err.status || 500, message: err.message, code: err.code });
}