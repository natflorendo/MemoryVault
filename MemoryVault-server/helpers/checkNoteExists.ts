import { Request, Response, NextFunction } from 'express';
import { prisma } from '../server';

export async function checkNoteExists (req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const existingNote = await prisma.note.findUnique({ where: { id } });
        if (!existingNote) {
            res.status(404).json({ error: `Note with id "${id}" not found.` });
            return;
        }
    
    next();
}