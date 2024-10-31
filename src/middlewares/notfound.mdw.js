import createHttpError from 'http-errors';

export default function(req, res, next) {
    next(createHttpError(404, 'Not Found'));
}