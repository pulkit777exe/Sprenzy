import jwt from "jsonwebtoken";

export const verifyJWT = (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1]; 

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        jwt.verify(token, process.env.JWT_SECRET || "thankyou for telling", (err, decoded) => {
            if (err) {
                console.error('JWT verification error:', err);
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized"
                });
            }
            
            req.user = {
                _id: decoded._id,
                email: decoded.email,
                isAdmin: decoded.isAdmin || false
            };
            
            next();
        });
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: "Authentication failed"
        });
    }
}; 

export const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }

    if (!req.user.isAdmin) {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin privileges required."
        });
    }

    next();
}; 