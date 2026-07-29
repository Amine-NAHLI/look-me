describe('configuration de production', () => {
  it('rejette un secret de démonstration', () => {
    const previous = { ...process.env };
    process.env.NODE_ENV = 'test'; process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/lookme_test';
    process.env.CLIENT_URL = 'http://localhost:5173'; process.env.CORS_ALLOWED_ORIGINS = process.env.CLIENT_URL;
    process.env.JWT_ACCESS_SECRET = 'generate-a-random-secret-of-at-least-32-characters';
    process.env.JWT_REFRESH_SECRET = 'x'.repeat(48);
    delete require.cache[require.resolve('../../config/env')];
    expect(() => require('../../config/env')).toThrow(/Invalid environment configuration/);
    process.env = previous;
  });
});
