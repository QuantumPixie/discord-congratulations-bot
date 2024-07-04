import { messageRepository } from '../../src/repositories/messageRepository';
import { db } from '../../src/database';
import { mapMessage } from '../../src/utils/mapTypes/mapMessage';

jest.mock('../../src/database');
jest.mock('../../src/utils/mapTypes/mapMessage');

describe('Message Repository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockMessages = [
    { id: 1, content: 'Hello World', user_id: 1, sprint_id: 1 },
  ];

  it('should return all messages', async () => {
    (db.selectFrom as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue(mockMessages),
    });
    (mapMessage as jest.Mock).mockImplementation((message) => message);

    const result = await messageRepository.findAll();
    expect(result).toEqual(mockMessages);
    expect(db.selectFrom).toHaveBeenCalledWith('messages');
    expect(mapMessage).toHaveBeenCalledWith(mockMessages[0]);
  });
});
