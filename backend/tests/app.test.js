const request = require('supertest');
const app = require('../src/app');

describe('Health Check Endpoint', () => {
  it('should return 200 and health status', async () => {
    const res = await request(app)
      .get('/health')
      .expect(200);

    expect(res.body).toHaveProperty('status', 'OK');
    expect(res.body).toHaveProperty('message', 'Server is running');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('uptime');
  });
});

describe('API Root Endpoint', () => {
  it('should return API information', async () => {
    const res = await request(app)
      .get('/api')
      .expect(200);

    expect(res.body).toHaveProperty('message', 'Welcome to SecureFlow API');
    expect(res.body).toHaveProperty('endpoints');
    expect(res.body).toHaveProperty('timestamp');
  });
});

describe('404 Handler', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app)
      .get('/unknown-route')
      .expect(404);

    expect(res.body).toHaveProperty('error', 'Route not found');
  });
});