import { describe, it, expect, beforeEach, vi } from 'vitest';
import { messageRepository } from '../../src/repositories/messageRepository';
import { db } from '../../src/database';
import { mapMessage } from '../../src/utils/mapTypes/mapMessage';

vi.mock('../../src/database');
vi.mock('../../src/utils/mapTypes/mapMessage');

describe('Message Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockMessages = [
    { id: 1, content: 'Hello World', user_id: 1, sprint_id: 1 },
  ];

  it('should return all messages', async () => {
    (db.selectFrom as vi.Mock).mockReturnValue({
      selectAll: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValue(mockMessages),
    });
    (mapMessage as vi.Mock).mockImplementation((message: any) => message);

    const result = await messageRepository.findAll();
    expect(result).toEqual(mockMessages);
    expect(db.selectFrom).toHaveBeenCalledWith('messages');
    expect(mapMessage).toHaveBeenCalledWith(mockMessages[0], 0, mockMessages);
  });
});
