import jwt from 'jsonwebtoken';
import user from '../models/users';
import { isAuthenticatedUser } from './auth';

const mockRequest = () => {
  return {
    headers: {
      authorization: 'Bearer eyJ...',
    },
  };
};

const mockResponse = () => {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
};

// Empty mock
const mockNext = jest.fn();

const mockUser = {
  _id: '6368dadd983d6c4b181e37c1',
  name: 'Test User',
  email: 'test@gmail.com',
  password: 'hashedPassword',
};

describe('Authentication Middleware', () => {
  it('should throw Missing authorization header error', async () => {
    const request = (mockRequest().headers = { headers: {} });
    const response = mockResponse();

    await isAuthenticatedUser(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(403);
    expect(response.json).toHaveBeenCalledWith({
      error: 'Missing Authorization header with Bearer token',
    });
  });

  it('should throw missing JWT error', async () => {
    const request = (mockRequest().headers = {
      headers: { authorization: 'Bearer' },
    });
    const response = mockResponse();

    await isAuthenticatedUser(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({
      error: 'Authentication Failed',
    });
  });

  it('should authenticate the user', async () => {
    jest.spyOn(jwt, 'verify').mockResolvedValueOnce({ id: mockUser._id });
    jest.spyOn(user, 'findById').mockResolvedValueOnce(mockUser);

    const request = mockRequest();
    const response = mockResponse();

    await isAuthenticatedUser(request, response, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});
