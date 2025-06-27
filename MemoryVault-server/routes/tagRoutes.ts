import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../server';

const router = Router();

// Retrieve all tags
// Mainly for suggestion auto complete feature
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tags = await prisma.tag.findMany({
        include: {
            Notes: {
                include: {
                    Tags: true,
                }
            }
        }
        });

        res.status(200).json(tags);
    } catch (err: any) {
        next(err);
    }
});

export default router;