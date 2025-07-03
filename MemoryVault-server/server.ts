import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from './generated/prisma';
import noteRoutes from './routes/noteRoutes';
import tagRoutes from './routes/tagRoutes';
import authRoutes from './routes/authRoutes';
import session from 'express-session';
import passport from 'passport';
import './helpers/passport'

const app = express();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET not defined');

app.use(express.json());
app.use(cors());

app.use(session({
  secret: JWT_SECRET,     // Used to sign the session ID cookie.
  resave: false,          // Don’t save session if nothing changed
  saveUninitialized: true // Save empty session for unauthenticated users 
}));

app.use(passport.initialize());
app.use(passport.session());

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