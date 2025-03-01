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

        jwt.verify(token, process.env.VITE_JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error('JWT verification error:', err);
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized"
                });
            }
            
            req.user = {
                _id: decoded.userId || decoded._id,
                email: decoded.email
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