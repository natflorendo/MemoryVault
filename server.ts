import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from './generated/prisma';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get('/notes', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notes = await prisma.note.findMany();
        res.status(200).json(notes);
    } catch(err: any) {
        next(err);
    }
});

app.post('/notes', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { body } = req.body
        const notes = await prisma.note.create({
            data: {
                body
            }
        });
        res.status(201).json(notes);
    } catch(err: any) {
        next(err);
    }
});

app.put('/notes/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { body } = req.body;
        const note = await prisma.note.update({
            where: { id },
            data: {
                body
            }
        });
        res.json(note);
    } catch(err: any) {
        next(err);
    }
});

//test route to clear db
app.delete('/notes/all', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await prisma.note.deleteMany();
        res.status(204).send();
    } catch(err: any) {
        next(err);
    }
});

app.delete('/notes/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await prisma.note.delete({
            where: {
                id
            }
        });
        res.status(204).send();
    } catch(err: any) {
        next(err);
    }
});

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
export default app;