import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from './generated/prisma';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

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
        err.status = err.status || 500;
        next(err);
    }
});

app.put('/notes/:id', async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { body } = req.body;
    const note = await prisma.note.update({
        where: { id },
        data: {
            body
        }
    });
    res.json(note);
});

app.delete('/notes/:id', async (req: Request, res: Response, next: NextFunction) => {
    // await prisma.note.deleteMany();
    const { id } = req.params;
    await prisma.note.delete({
        where: {
            id
        }
    });
    res.status(204).send();
});

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    res.status(status).json({error: err.message })
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