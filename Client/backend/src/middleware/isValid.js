import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("Secret environment variable not present");
}

export default function isValid(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            message: "Authorization token not provided"
        });
    }

    try {
        const user = verifyToken(token);

        if (!user) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        req.user = user; 
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
}

function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}