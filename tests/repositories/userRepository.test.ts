import { describe, it, expect, beforeEach, vi } from 'vitest';
import { userRepository } from '../../src/repositories/userRepository';
import { db } from '../../src/database';
import { mapUser } from '../../src/utils/mapTypes/mapUser';

vi.mock('../../src/database');
vi.mock('../../src/utils/mapTypes/mapUser');

describe('User Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockUsers = [{ id: 1, user_name: 'john_doe' }];

  it('should return all users', async () => {
    (db.selectFrom as vi.Mock).mockReturnValue({
      selectAll: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValue(mockUsers),
    });
    (mapUser as vi.Mock).mockImplementation((user: any) => user);

    const result = await userRepository.findAll();
    expect(result).toEqual(mockUsers);
    expect(db.selectFrom).toHaveBeenCalledWith('users');
    expect(mapUser).toHaveBeenCalledWith(mockUsers[0], 0, mockUsers);
  });
});
