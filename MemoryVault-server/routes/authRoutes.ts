import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../server';
import { checkEmail, checkEmailAndPassword } from '../helpers/checkEmail';
import { requireAuth } from '../helpers/requireAuth';
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

//Dev Only: get all users
router.get('/all', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await prisma.user.findMany();

        res.status(200).json(users);
    } catch (err: any) {
        next(err);
    }
});

export default router;