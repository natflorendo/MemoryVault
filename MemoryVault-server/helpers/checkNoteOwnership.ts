import { Request, Response, NextFunction } from 'express';
import { prisma } from '../server';

export async function checkNoteOwnership (req: Request, res: Response, next: NextFunction) {
    try {
        const note = await prisma.note.findUnique({ where: { id: req.params.id } })

        if(!note || note.userId !== (req as any).userId) {
            res.status(400).json({ error: "Not authorized to access this note" });
            return;
        }
    } catch (err: any) {
        next(err);
    }
};