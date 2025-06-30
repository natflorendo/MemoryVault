import { Request, Response, NextFunction } from 'express';

export function checkNoteBody (req: Request, res: Response, next: NextFunction) {
    const { body } = req.body;
    if(!body) {
        res.status(400).json({ error: 'Missing "body" in request'});
        return;
    }
    
    if(
        body.type !== 'doc' || 
        !Array.isArray(body.content) || 
        body.content.length === 0
    ) {
        res.status(400).json({ 
            error: 'Invalid "body" format: must include type "doc" and a valid content array'
        });
        return;
    }
    next();
}