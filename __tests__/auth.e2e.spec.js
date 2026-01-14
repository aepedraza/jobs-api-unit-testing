import request from 'supertest';
import app from '../app';
import { connectDatabase, closeDatabase } from './db-handler';

beforeAll(async () => await connectDatabase());

afterAll(async () => await closeDatabase());

const email = 'user@domain.com';
const password = '12345678';
const wrong_password = '1234';

describe('[e2e] Auth', () => {
  describe('(POST) Register User', () => {
    it('should throw validation error', async () => {
      const res = await request(app).post('/api/v1/register').send({
        name: 'Test User',
        email: 'test@mail.com',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Please enter all values');
    });

    it('should register the user', async () => {
      const res = await request(app).post('/api/v1/register').send({
        name: 'Test User',
        email: email,
        password: password,
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.token).toBeDefined();
    });

    it('should throw duplicate email error (depends on previous)', async () => {
      const res = await request(app).post('/api/v1/register').send({
        name: 'Test User',
        email: email,
        password: password,
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Duplicate email');
    });
  });

  describe('(POST) Login User', () => {
    it('should throw missing email or password error', async () => {
      const response = await request(app).post('/api/v1/login').send({
        email: email,
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Please enter email & Password');
    });

    it('should throw invalid email or password error', async () => {
      const response = await request(app).post('/api/v1/login').send({
        email: email,
        password: wrong_password,
      });

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe('Invalid Email or Password');
    });

    it('should login user', async () => {
      const response = await request(app).post('/api/v1/login').send({
        email: email,
        password: password,
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.token).toBeDefined();
    });
  });

  describe('(404) Route not found', () => {
    it('should throw route not found error', async () => {
      const response = await request(app).post('/api/v1/invalid');

      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe('Route not found');
    });
  });
});
