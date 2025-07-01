import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../helpers/requireAuth';
import { prisma } from '../server';

const router = Router();

router.use(requireAuth);

// Retrieve all tags
// Mainly for suggestion auto complete feature
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).userId;
        
        const tags = await prisma.tag.findMany({
            where: {
                Notes: {
                    some: {
                        userId: userId,
                    },
                },
            },
            include: {
                Notes: {
                    where: { userId },
                    include: {
                        Tags: true,
                    },
                },
            },
        });

        res.status(200).json(tags);
    } catch (err: any) {
        next(err);
    }
});

export default router;