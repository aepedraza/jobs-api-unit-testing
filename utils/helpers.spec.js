import jwt from 'jsonwebtoken';
import { getJwtToken, sendEmail } from './helpers';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValueOnce({
    sendMail: jest.fn().mockResolvedValueOnce({
      accepted: ['test@gmail.com'],
    }),
  }),
}));

afterAll(() => {
  jest.resetAllMocks();
});

describe('Utils/helpers', () => {
  describe('JWT Token', () => {
    it('should give JWT token', async () => {
      jest.spyOn(jwt, 'sign').mockResolvedValueOnce('token');

      const token = await getJwtToken('6368dadd983d6c4b181e37c1');

      expect(token).toBeDefined();
      expect(token).toBe('token');
    });
  });

  describe('Send Mail', () => {
    it('should send email to user', async () => {
      const response = await sendEmail({
        email: 'test@gmail.com',
        subject: 'Password Reset',
        message: 'This is test message.',
      });

      expect(response).toBeDefined();
      expect(response.accepted).toContain('test@gmail.com');
    });
  });
});
