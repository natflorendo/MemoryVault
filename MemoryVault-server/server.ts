import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from './generated/prisma';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

function validateNoteBody(body: any, res: Response): boolean {
    if(!body) {
        res.status(400).json({ error: 'Missing "body" in request'});
        return false;
    }
    
    if(
        body.type !== 'doc' || 
        !Array.isArray(body.content) || 
        body.content.length === 0
    ) {
        res.status(400).json({ 
            error: 'Invalid "body" format: must include type "doc" and a valid content array'
        });
        return false;
    }
    return true;
}

async function validateNoteId (id: any, res: Response): Promise<boolean> {
    const existingNote = await prisma.note.findUnique({ where: { id } });
        if (!existingNote) {
            res.status(404).json({ error: `Note with id "${id}" not found.` });
            return false;
        }
    
    return true;
}

app.get('/notes', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notes = await prisma.note.findMany({
            include: { Tags: true }
        });
        res.status(200).json(notes);
    } catch(err: any) {
        next(err);
    }
});

app.post('/notes', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { body, tags } = req.body

        if(!validateNoteBody(body, res)) { return; }

        const tagData = 
            tags?.length ? {
                connectOrCreate: tags.map((name: string) => ({
                    where: { name },
                    create: { name }
                }))
            } : undefined

        const notes = await prisma.note.create({
            data: {
                body,
                //only add Tags if a non-empty tags array is given
                ...(tagData && { Tags: tagData })
            },
            include: { Tags: true}
        });
        res.status(201).json(notes);
    } catch(err: any) {
        next(err);
    }
});

app.put('/notes/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { body, tags } = req.body;

        if (!(await validateNoteId(id, res))) { return; }

        if(!validateNoteBody(body, res)) { return; }

        const tagData = Array.isArray(tags)
            ? {
                set: [],
                ...(tags.length > 0 && {
                    connectOrCreate: tags.map((name: string) => ({
                        where: { name },
                        create: { name }
                    }))
                })
            } as any
            : undefined

        const note = await prisma.note.update({
            where: { id },
            data: {
                body,
                Tags: tagData
            }
        });

        // Clean up unused tags after updating note
        await prisma.tag.deleteMany({
            where: {
                Notes: { none: {} }
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

        await prisma.tag.deleteMany({
            where: {
                Notes: { none: {} }
            }
        });

        res.status(204).send();
    } catch(err: any) {
        next(err);
    }
});

app.delete('/notes/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!(await validateNoteId(id, res))) { return; }

        await prisma.note.delete({
            where: {
                id
            }
        });

        // Clean up unused tags after deleting note
        await prisma.tag.deleteMany({
            where: {
                Notes: { none: {} }
            }
        });

        res.status(204).send();
    } catch(err: any) {
        next(err);
    }
});

// For testing purposes. need to see if tags get added and deleted when appropriate
app.get('/tags', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tags = await prisma.tag.findMany({
        include: {
            Notes: true
        }
        });

        res.status(200).json(tags);
    } catch (err: any) {
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