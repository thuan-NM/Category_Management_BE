import createHttpError from "http-errors"

export default function(req, res, next) {
    throw createHttpError(404, "Not Found Route")
}