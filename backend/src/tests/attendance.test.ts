import request from 'supertest';
import app from '../index';

describe('Attendance API Integration Tests', () => {
  it('GET /api/attendance/session/fake-id should reject unauthorized requests', async () => {
    const res = await request(app).get('/api/attendance/session/60c72b2f9b1d8b2bad6838a1');
    expect(res.status).toBe(401);
  });

  it('GET /api/ai/status should reject unauthenticated requests', async () => {
    const res = await request(app).get('/api/ai/status');
    expect(res.status).toBe(401);
  });
});
