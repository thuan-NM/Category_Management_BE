export default function(req, res, next) {
    res.fly = ({ status, code, data, message, option }) => {
        res.status(status).json({
            code,
            message,
            data,
            option
        })
    }
    next();
};