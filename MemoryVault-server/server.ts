import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import noteRoutes from './routes/noteRoutes';
import tagRoutes from './routes/tagRoutes';
import authRoutes from './routes/authRoutes';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import helmet from 'helmet';
import './helpers/passport'

const app = express();
const prisma = new PrismaClient();
const allowedOrigins = [process.env.FRONTEND_URL];
if (!process.env.FRONTEND_URL) { throw new Error('FRONTEND_URL not defined in environment'); }

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) { throw new Error('JWT_SECRET not defined'); }

app.use(express.json());
app.use(helmet());

app.use(cors({
    origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
    } else {
        console.warn(`Blocked by CORS: ${origin}`);
        callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use(passport.initialize());

// Trust the first proxy hop (Render/Heroku-style)
app.set("trust proxy", 1); // or `true` to trust all hops

app.use('/notes', noteRoutes);
app.use('/tags', tagRoutes);
app.use('/auth', authRoutes);


const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    res.status(status).json({error: err.message, statusCode: status })
}
app.use(errorHandler);


//Only listen when not being imported by test
if(require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

//Export app for testing access
export { app, prisma };