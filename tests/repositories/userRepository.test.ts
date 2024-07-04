import { userRepository } from '../../src/repositories/userRepository';
import { db } from '../../src/database';
import { mapUser } from '../../src/utils/mapTypes/mapUser';

jest.mock('../../src/database');
jest.mock('../../src/utils/mapTypes/mapUser');

describe('User Repository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUsers = [{ id: 1, user_name: 'john_doe' }];

  it('should return all users', async () => {
    (db.selectFrom as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue(mockUsers),
    });
    (mapUser as jest.Mock).mockImplementation((user) => user);

    const result = await userRepository.findAll();
    expect(result).toEqual(mockUsers);
    expect(db.selectFrom).toHaveBeenCalledWith('users');
    expect(mapUser).toHaveBeenCalledWith(mockUsers[0]);
  });
});
