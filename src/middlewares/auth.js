// src/middlewares/auth.js
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';

// Middleware to verify JWT token
const auth = (req, res, next) => {
    try {
        // Check if the authorization header exists and starts with "Bearer"
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            throw createHttpError(401, 'Access denied. No token provided.');
        }

        // Extract the token from the authorization header
        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            throw createHttpError(401, 'Access denied. No token provided.');
        }

        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user information to request object
        req.user = decoded;

        next();
    } catch (err) {
        next(createHttpError(401, 'Invalid or expired token.'));
    }
};

export default auth;