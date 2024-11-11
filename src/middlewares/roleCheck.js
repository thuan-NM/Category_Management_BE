// src/middlewares/roleCheck.js
import createHttpError from 'http-errors';

// Middleware to check user's role for certain actions
const roleCheck = (requiredRole) => {
    return (req, res, next) => {
        const { user } = req.user;
        console.log('User role:', user.role);
        // Check if user and user role are available
        if (!user || !user.role) {
            return next(createHttpError(403, 'Access denied.'));
        }

        // Check if the user role matches the required role
        if (requiredRole === 'admin' && user.role !== 'admin') {
            return next(createHttpError(403, 'You do not have the necessary privileges.'));
        }

        next();
    };
};

export default roleCheck;