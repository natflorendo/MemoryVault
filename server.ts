import express, { Request, Response, NextFunction } from 'express';

const app = express();

app.use(express.json());

interface Note {
    id: string;
    body: string;
    timestamp: Date;
}

let notes: Note[] = [
    {
        id: crypto.randomUUID(),
        body: "",
        timestamp: new Date(),
    }
];

app.get('/notes', async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(notes);
});

app.post('/notes', async (req: Request, res: Response, next: NextFunction) => {
    notes.push({
        id: crypto.randomUUID(),
        body: "",
        timestamp: new Date(),
    });
    res.status(201).json(notes);
});

app.put('/notes/:id', async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    res.json(`ID given: ${id}`);
});

app.delete('/notes/:id', async (req: Request, res: Response, next: NextFunction) => {
    notes = []
    res.status(204).send();
});


//Only listen when not beiis theng imported by test
if(require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

//Export app for testing access
export default app;