import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../server';
import { checkEmail, checkEmailAndPassword } from '../helpers/checkEmail';
import { requireAuth } from '../helpers/requireAuth';
import { sendResetEmail } from '../helpers/sendResetEmail';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Register
router.post('/register', checkEmailAndPassword, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if(existingUser) {
            res.status(400).json({ error: "User already exists" });
            return;
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashed
            }
        });

        res.status(201).json({ message: "User Registered", userId: user.id })
    } catch (err: any) {
        next(err);
    }
});

// Login
router.post('/login', checkEmailAndPassword, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (err: any) {
        next(err);
    }
});

// Get current user
router.get('/me', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: (req as any).userId } });
        
        if(!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        res.status(200).json(user)
    } catch (err: any) {
        next(err);
    }
});

// Delete a user
router.delete('/', checkEmail, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (!existingUser) {
            res.status(404).json({ error: "User not found" });
            return
        }

        await prisma.user.delete({ where: { email } });

        res.status(204).send();
    } catch (err: any) {
        next(err);
    }
});

// Dev Only: get all users
router.get('/all', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await prisma.user.findMany();

        res.status(200).json(users);
    } catch (err: any) {
        next(err);
    }
});

// Request reset code
router.post('/request-reset', checkEmail, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if(!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        // Create 6 digit reset code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        // Reset code expires in 15 minutes
        // Convert minutes to seconds then milliseconds
        const expiry = new Date(Date.now() + 15 * 60 * 1000);

        await prisma.user.update({
            where: { email },
            data: {
                resetCode: code,
                resetCodeExpiry: expiry,
            },
        });

        await sendResetEmail(email, code);
        
        res.status(200).json({ message: `Reset code sent to email - ${code}`});
    } catch (err: any) {
        next(err);
    }
});

// Verify reset code
router.post('/verify-reset-code', checkEmail, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, code } = req.body;

        const user = await prisma.user.findFirst({
            where: {
                email,
                resetCode: code,
                resetCodeExpiry: { gt: new Date() }
            }
        });

        if(!user) {
            res.status(400).json({ error: "Invalid or expired code"});
            return;
        }

        res.status(200).json({ message: "Code Valid"});
    } catch (err: any) {
        next(err);
    }
});

router.post('/set-new-password', checkEmailAndPassword, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, code } = req.body;
        const newPassword = req.body.password;

        const user = await prisma.user.findFirst({
            where: {
                email,
                resetCode: code,
                resetCodeExpiry: { gt: new Date() }
            }
        });

        if(!user) {
            res.status(400).json({ error: "Reset not initiated or expired"});
            return;
        }
        
        const hashed = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { email },
            data: {
                password: hashed,
                resetCode: null,
                resetCodeExpiry: null,
            },
        });
        
        res.status(200).json({ message: "Password reset successful"});
    } catch (err: any) {
        next(err);
    }
});

export default router;