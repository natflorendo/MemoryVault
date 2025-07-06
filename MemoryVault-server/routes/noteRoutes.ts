import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../server';
import { checkNoteBody } from '../helpers/checkNoteBody';
import { checkNoteExists } from '../helpers/checkNoteExists';
import { checkNoteOwnership } from '../helpers/checkNoteOwnership';
import { requireAuth } from '../helpers/requireAuth';
import { tagTopEmotion } from '../services/huggingface';

const router = Router();

router.use(requireAuth);

// Get all notes
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notes = await prisma.note.findMany({
            where: { userId: (req as any).userId },
            include: { 
                Tags: true, 
            }
        });
        res.status(200).json(notes);
    } catch(err: any) {
        next(err);
    }
});

// Create a new note
router.post('/', checkNoteBody, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { body } = req.body;

        const notes = await prisma.note.create({
            data: {
                userId: (req as any).userId,
                body
            },
            include: { Tags: true }
        });

        const updatedNote = await tagTopEmotion(notes.id, body)
        res.status(201).json(updatedNote);
    } catch(err: any) {
        next(err);
    }
});

// Update only note body
router.put('/:id', checkNoteExists, checkNoteBody, checkNoteOwnership,
    async (req: Request, res: Response, next: NextFunction) => {
    try {
        const note = await prisma.note.update({
            where: { id: req.params.id },
            data: {
                body: req.body.body,
            },
            include: { Tags: true}
        });

        res.status(200).json(note);
    } catch(err: any) {
        next(err);
    }
});

// Delete a single note
router.delete('/:id', checkNoteExists, checkNoteOwnership, async (req: Request, res: Response, next: NextFunction) => {
    try {
        await prisma.note.delete({
            where: { id: req.params.id }
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

// Add tags to note incrementally
router.post('/:id/tags', checkNoteExists, checkNoteOwnership, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { tag } = req.body;

        if (typeof tag !== 'string' || tag.trim() === '') {
            res.status(400).json({ error: 'Provide a valid non-empty tag to add' });
            return;
        }

        const note = await prisma.note.update({
            where: { id: req.params.id },
            data: {
                Tags: {
                    connectOrCreate: {
                        where: { name: tag },
                        create: { name: tag }
                    }
                }
            },
            include: { Tags: true }
        });

        res.status(200).json(note);
    } catch (err: any) {
        next(err);
    }
});

// Remove tags from note incrementally
router.delete('/:id/tags', checkNoteExists, checkNoteOwnership, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { tag } = req.body;

        if (typeof tag !== 'string' || tag.trim() === '') {
            res.status(400).json({ error: 'Provide a valid non-empty tag to remove' });
            return;
        }

        const note = await prisma.note.update({
            where: { id: req.params.id },
            data: {
                Tags: {
                    disconnect: { name: tag }
                }
            },
            include: { Tags: true }
        })

        // Clean up unused tags
        await prisma.tag.deleteMany({
            where: {
                Notes: { none: {} }
            }
        });

        res.status(204).send(note)
    } catch(err: any) {
        next(err);
    }
});

// Dev Only: Clear all Notes and Tags
if(process.env.NODE_ENV === 'development') {
    router.delete('/all', async (req: Request, res: Response, next: NextFunction) => {
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
}

export default router;