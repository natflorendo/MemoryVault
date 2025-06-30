import { Request, Response, NextFunction } from 'express';
// JavaScript regex for email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function checkEmail(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;

    if(!email) {
        res.status(400).json({ error: "Email is required" });
        return;
    }

    if (!emailRegex.test(email)) {
        res.status(400).json({ error: "Invalid email format" });
        return;
    }

    next();
}

export async function checkEmailAndPassword(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    if(!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
    }

    if (!emailRegex.test(email)) {
        res.status(400).json({ error: "Invalid email format" });
        return;
    }

    next();
}