process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/lookme_test';
process.env.CLIENT_URL = 'http://localhost:5173';
process.env.CORS_ALLOWED_ORIGINS = 'http://localhost:5173';
process.env.JWT_ACCESS_SECRET = 'test-access-secret-very-long-and-unique-value-1234';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-very-long-and-unique-value-1234';

const request = require('supertest');
const { createApp } = require('../../app');

describe('frontière HTTP', () => {
  const app = createApp();

  it('expose une sonde de santé sans fuite interne', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('bloque les origines CORS non déclarées', async () => {
    const response = await request(app).get('/api/products').set('Origin', 'https://evil.example');
    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('CORS_ORIGIN_DENIED');
    expect(response.body.error.message).not.toMatch(/stack|mongo|jwt/i);
  });
});
