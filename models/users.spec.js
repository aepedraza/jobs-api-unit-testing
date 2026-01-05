import User from './users';

afterEach(() => {
  jest.resetAllMocks();
});

describe('User model', () => {
  it('should create a new user', () => {
    const user = new User({
      name: 'John Doe',
      email: 'jdoe@domain.com',
      password: '12345678',
    });

    expect(user).toHaveProperty('_id');
  });

  it('should throw validation error for required fields', async () => {
    const user = new User();

    try {
      await user.validate();
    } catch (e) {
      expect(e.errors.name).toBeDefined();
      expect(e.errors.email).toBeDefined();
      expect(e.errors.password).toBeDefined();
    }
  });

  it('should throw password lenght error', async () => {
    const user = new User({
      name: 'John Doe',
      email: 'jdoe@domain.com',
      password: '123456',
    });

    try {
      await user.validate();
    } catch (e) {
      expect(e.errors.password).toBeDefined();
      expect(e.errors.password.message).toMatch(
        /Your password must be at least 8 characters long/
      ); // using regex just to play around
    }
  });
});
