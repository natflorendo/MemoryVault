import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    
    if(!token) {
        res.status(401).json({ error: "Token missing" });
        return;
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET) as { userId: string};
        (req as any).userId = payload.userId;
        next();
    } catch (err: any) {
        res.status(401).json({ error: "Invalid token" });
        return;
    }
}