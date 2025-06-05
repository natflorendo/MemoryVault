import request from 'supertest';
import app from '../server';
import { PrismaClient } from '../generated/prisma';
const prisma = new PrismaClient();

async function createTestNote(id = `Test-ID-${crypto.randomUUID()}`) {
  const testNote = await prisma.note.create({
    data: {
      id,
      body: {
        title: "Test note",
        content: "This is a test body",
      },
    },
  });

  return testNote;
}

beforeEach(async () => {
    await createTestNote();
});

afterEach(async () => {
    await prisma.note.deleteMany({
        where: {
            id: { contains: "Test-ID" }
        }
    });
});

describe('GET /notes', () => {
    it('should return 200 OK', async () => {
        const res = await request(app).get('/notes');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
  });

    it('should return an emput array when no notes exist', async () => {
        await prisma.note.deleteMany();
        const res = await request(app).get('/notes');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });
});

describe('POST /notes', () => {
    it('should return 201 OK', async () => {
        const newNote = {
            body: {
                title: "New test note",
                content: "This is another test body",
            },
        };
        let getRes = await request(app).get('/notes');
        expect(getRes.statusCode).toBe(200);
        expect(getRes.body).toHaveLength(1);

        const postRes = await request(app)
                .post('/notes')
                .send(newNote);
        expect(postRes.status).toBe(201);

        getRes = await request(app).get('/notes');
        expect(getRes.statusCode).toBe(200);
        expect(getRes.body).toHaveLength(2);

        await request(app).delete(`/notes/${postRes.body.id}`)
    });
});

describe('PUT /notes', () => {
    it('should return the updated note', async () => {
        const newNote = await createTestNote();
        let parsedBody = newNote.body as { title: string; content: string };
        expect(parsedBody.title).toBe("Test note");
        expect(parsedBody.content).toBe("This is a test body");
        newNote.body = {
            title: "Updated title",
            content: "Updated content"
        };

        const res = await request(app).put(`/notes/${newNote.id}`).send(newNote);
        expect(res.status).toBe(200);

        parsedBody = newNote.body as { title: string; content: string };
        expect(parsedBody.title).toBe("Updated title");
        expect(parsedBody.content).toBe("Updated content");
    });
});

describe('DELETE /notes', () => {
    it('should return ID Deleted', async () => {
        const newNote = await createTestNote();
        let getRes = await request(app).get('/notes');
        expect(getRes.statusCode).toBe(200);
        expect(getRes.body).toHaveLength(2);

        const res = await request(app).delete(`/notes/${newNote.id}`);
        expect(res.status).toBe(204);

        getRes = await request(app).get('/notes');
        expect(getRes.statusCode).toBe(200);
        expect(getRes.body).toHaveLength(1);
    });
});