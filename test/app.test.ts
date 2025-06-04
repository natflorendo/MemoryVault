import request from 'supertest';
import { app, notes }from '../server';

describe('GET /notes', () => {
    it('should return 200 OK', async () => {
        const res = await request(app).get('/notes');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
  });
});

describe('POST /notes', () => {
    it('should return 201 OK', async () => {
        const res = await request(app).post('/notes');
        expect(res.status).toBe(201);
        expect(res.body.length).toBeGreaterThan(1);
    });
});

describe('PUT /notes', () => {
    it('should return ID 427', async () => {
        const res = await request(app).put('/notes/427');
        expect(res.status).toBe(200);
        expect(res.body).toBe("ID given: 427");
    });
});

describe('DELETE /notes', () => {
    it('should return ID Deleted', async () => {
        const res = await request(app).delete('/notes/123');
        expect(res.status).toBe(204);
    });
});