import request from 'supertest';
import app from '../app';
import { connectDatabase, closeDatabase } from './db-handler';

const email = 'user@domain.com';
const password = '12345678';
const newJob = {
  title: 'Node Developer',
  description:
    'Must be a full-stack developer, able to implement everything in a MEAN or MERN stack paradigm (MongoDB, Express, Angular and/or React, and Node.js).',
  email: 'employeer1@gmail.com',
  address: '651 Rr 2, Oquawka, IL, 61469',
  company: 'Knack Ltd',
  positions: 2,
  salary: 155000,
};

let jwtToken = '';
let jobCreated = '';

beforeAll(async () => {
  await connectDatabase();

  const res = await request(app).post('/api/v1/register').send({
    name: 'Test User',
    email: email,
    password: password,
  });

  jwtToken = res.body.token;
});

afterAll(async () => await closeDatabase());

describe('[e2e] Jobs', () => {
  describe('(GET) Get all jobs', () => {
    it('should get all jobs', async () => {
      const response = await request(app).get('/api/v1/jobs');

      expect(response.statusCode).toBe(200);
      expect(response.body.jobs).toBeInstanceOf(Array);
    });
  });

  describe('(POST) Create new job', () => {
    it('should throw validation error', async () => {
      const response = await request(app)
        .post('/api/v1/job/new')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ title: 'Java Developer Sr.' });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Please enter all values');
    });

    it('should create a new job', async () => {
      const response = await request(app)
        .post('/api/v1/job/new')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(newJob);

      expect(response.statusCode).toBe(201);
      expect(response.body.job).toMatchObject(newJob);
      expect(response.body.job._id).toBeDefined();

      jobCreated = response.body.job;
    });
  });

  describe('(GET) Get a job by id', () => {
    it('should get job by id', async () => {
      const response = await request(app).get(`/api/v1/job/${jobCreated._id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.job).toMatchObject(jobCreated);
    });

    it('should throw job not found error', async () => {
      const response = await request(app).get(
        '/api/v1/job/636ad8d88242262f5d0d85ca'
      );

      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe('Job not found');
    });

    it('should throw invalid id error', async () => {
      const response = await request(app).get('/api/v1/job/124');

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Please enter correct id');
    });
  });

  describe('(PUT) Update a Job', () => {
    it('should throw job not found error', async () => {
      const response = await request(app)
        .put('/api/v1/job/636ad8d88242262f5d0d85ca')
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe('Job not found');
    });

    it('should update the job by id', async () => {
      const response = await request(app)
        .put(`/api/v1/job/${jobCreated._id}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ title: 'Updated name' });

      expect(response.statusCode).toBe(200);
      expect(response.body.job.title).toBe('Updated name');
    });
  });

  describe('(DELETE) Delete a Job', () => {
    it('should throw job not found error', async () => {
      const response = await request(app)
        .delete('/api/v1/job/636ad8d88242262f5d0d85ca')
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe('Job not found');
    });

    it('should delete the job by id', async () => {
      const response = await request(app)
        .put(`/api/v1/job/${jobCreated._id}`)
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.job._id).toBe(jobCreated._id);
    });
  });
});
