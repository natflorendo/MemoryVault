import request from 'supertest';
import { app } from '../server'
import { PrismaClient } from '../generated/prisma';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
let token: string;
let userId: string;

async function createTestUserAndToken() {
  const user = await prisma.user.create({
    data: {
      email: `test-${crypto.randomUUID()}@test.com`,
      password: 'hashed-password-placeholder', // not validated in token-only logic
    },
  });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

  return { user, token };
}


// Helper for a valid note body
const validDocBody = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'Test content' }],
    },
  ],
};

async function createTestNote(id = `Test-ID-${crypto.randomUUID()}`) {
  const testNote = await prisma.note.create({
    data: {
      id,
      body: validDocBody,
      userId,
    },
  });

  return testNote;
}

beforeEach(async () => {
  const result = await createTestUserAndToken();
  token = result.token;
  userId = result.user.id;  
  await createTestNote();
});

afterEach(async () => {
    await prisma.note.deleteMany({
        where: {
            id: { contains: "Test-ID" }
        }
    });
    await prisma.user.delete({ where: { id: userId } });
});

describe('GET /notes', () => {
    it('should return 200 OK', async () => {
        const res = await request(app)
          .get('/notes')
          .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
  });
});

describe('POST /notes', () => {
    it('should return 201 OK', async () => {
        const res = await request(app)
          .post('/notes')
          .set('Authorization', `Bearer ${token}`)
          .send({ 
            body: validDocBody 
          });
        await request(app)
          .delete(`/notes/${res.body.id}`)
          .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(201);
        expect(res.body.body.type).toBe('doc');
    });

    it('should return 400 if body is missing', async () => {
        const res = await request(app)
          .post('/notes')
          .set('Authorization', `Bearer ${token}`)
          .send({});

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/Missing "body"/);
    });

    it('should return 400 if body format is invalid', async () => {
    const res = await request(app)
      .post('/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        body: { type: 'text', content: [] },
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Invalid "body" format/);
  });
});

describe('PUT /notes/:id', () => {
    it('should return the updated note', async () => {
        const note = await createTestNote();
        const updatedBody = {
            type: 'doc',
            content: [
                {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Updated content' }],
                },
            ],
        };

        const res = await request(app)
          .put(`/notes/${note.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ body: updatedBody });

        expect(res.statusCode).toBe(200);
        expect(res.body.body.content[0].content[0].text).toBe('Updated content');
    });

    it('should return 404 for missing ID', async () => {
    const res = await request(app)
      .put('/notes/:id')
      .set('Authorization', `Bearer ${token}`)
      .send({ body: validDocBody });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/not found/);
  });
});

describe('DELETE /notes', () => {
    it('should delete the note', async () => {
        const note = await createTestNote();
        const delRes = await request(app)
          .delete(`/notes/${note.id}`)
          .set('Authorization', `Bearer ${token}`);

        expect(delRes.statusCode).toBe(204);

        const getRes = await request(app)
          .get('/notes')
          .set('Authorization', `Bearer ${token}`);;
        const deleted = getRes.body.find((n: any) => n.id === note.id);
        expect(deleted).toBeUndefined();
    });

    it('should return 400', async () => {
      const res = await request(app)
        .delete('/notes/invalid-uuid')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toMatch(/not found/);
    });
});