import request from 'supertest';
import app from '../index';

describe('Auth API Unit & Integration Tests', () => {
  it('GET /api/health should return 200 and healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('attendai-backend');
  });

  it('POST /api/auth/login should fail without credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});
    expect([400, 422]).toContain(res.status);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/classes without token should return 401 Unauthorized', async () => {
    const res = await request(app).get('/api/classes');
    expect(res.status).toBe(401);
  });
});
