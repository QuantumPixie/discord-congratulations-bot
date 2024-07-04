import { createAndSendMessage } from '../../src/services/messageService';
import { fetchRandomGif } from '../../src/services/gifService';
import {
  sendMessageToDiscord,
  fetchDiscordUser,
} from '../../src/services/discordService';
import { messageRepository } from '../../src/repositories/messageRepository';
import { templateRepository } from '../../src/repositories/templateRepository';
import { sprintRepository } from '../../src/repositories/sprintRepository';
import { userRepository } from '../../src/repositories/userRepository';
import { InsertableMessage } from '../../src/database/types';
import { mapUser } from '../../src/utils/mapTypes/mapUser';
import { mapSprint } from '../../src/utils/mapTypes/mapSprint';
import { mapTemplate } from '../../src/utils/mapTypes/mapTemplate';

jest.mock('../../src/services/gifService');
jest.mock('../../src/services/discordService');
jest.mock('../../src/repositories/messageRepository');
jest.mock('../../src/repositories/templateRepository');
jest.mock('../../src/repositories/sprintRepository');
jest.mock('../../src/repositories/userRepository');
jest.mock('../../src/utils/mapTypes/mapUser');
jest.mock('../../src/utils/mapTypes/mapSprint');
jest.mock('../../src/utils/mapTypes/mapTemplate');

describe('createAndSendMessage', () => {
  const username = 'johndoe';
  const sprintCode = 'WD-1.1';
  const channelId = '1234567890';
  const gifUrl = 'http://example.com/gif';

  beforeEach(() => {
    process.env.DISCORD_CHANNEL_ID = channelId;
    jest.clearAllMocks();
  });

  it('should create and send a message successfully', async () => {
    const mockUser = { id: 1, user_name: 'johndoe' };
    const mockSprint = { id: 1, sprint_name: 'Sprint 1' };
    const mockTemplate = {
      id: 1,
      message_template: 'Hello {username}, welcome to {sprintTitle}!',
    };

    (fetchDiscordUser as jest.Mock).mockResolvedValue(mockUser);
    (userRepository.findByUserName as jest.Mock).mockResolvedValue(mockUser);
    (userRepository.create as jest.Mock).mockResolvedValue(mockUser);
    (sprintRepository.findBySprintCode as jest.Mock).mockResolvedValue(
      mockSprint
    );
    (templateRepository.findRandom as jest.Mock).mockResolvedValue(
      mockTemplate
    );
    (fetchRandomGif as jest.Mock).mockResolvedValue(gifUrl);
    (sendMessageToDiscord as jest.Mock).mockResolvedValue(undefined);
    (messageRepository.create as jest.Mock).mockResolvedValue(undefined);
    (mapUser as jest.Mock).mockImplementation((user) => user);
    (mapSprint as jest.Mock).mockImplementation((sprint) => sprint);
    (mapTemplate as jest.Mock).mockImplementation((template) => template);

    await createAndSendMessage(username, sprintCode);

    expect(fetchDiscordUser).toHaveBeenCalledWith(username);
    expect(userRepository.findByUserName).toHaveBeenCalledWith(username);
    expect(sprintRepository.findBySprintCode).toHaveBeenCalledWith(sprintCode);
    expect(templateRepository.findRandom).toHaveBeenCalled();
    expect(fetchRandomGif).toHaveBeenCalledWith('celebration');
    expect(sendMessageToDiscord).toHaveBeenCalledWith(
      channelId,
      `Hello johndoe, welcome to Sprint 1!\n${gifUrl}`
    );
    expect(messageRepository.create).toHaveBeenCalledWith({
      user_id: 1,
      template_id: 1,
      sprint_id: 1,
      timestamp: expect.any(String),
    });
  });

  it('should handle user not found in both Discord and database', async () => {
    (fetchDiscordUser as jest.Mock).mockResolvedValue(undefined);
    (userRepository.findByUserName as jest.Mock).mockResolvedValue(undefined);

    await expect(createAndSendMessage(username, sprintCode)).rejects.toThrow(
      'User not found in both Discord server and database'
    );
  });

  it('should handle sprint not found', async () => {
    const mockUser = { id: 1, user_name: 'johndoe' };
    (fetchDiscordUser as jest.Mock).mockResolvedValue(mockUser);
    (userRepository.findByUserName as jest.Mock).mockResolvedValue(mockUser);
    (sprintRepository.findBySprintCode as jest.Mock).mockResolvedValue(
      undefined
    );

    await expect(createAndSendMessage(username, sprintCode)).rejects.toThrow(
      'Sprint not found'
    );
  });

  it('should handle template not found', async () => {
    const mockUser = { id: 1, user_name: 'johndoe' };
    const mockSprint = { id: 1, sprint_name: 'Sprint 1' };
    (fetchDiscordUser as jest.Mock).mockResolvedValue(mockUser);
    (userRepository.findByUserName as jest.Mock).mockResolvedValue(mockUser);
    (sprintRepository.findBySprintCode as jest.Mock).mockResolvedValue(
      mockSprint
    );
    (templateRepository.findRandom as jest.Mock).mockResolvedValue(undefined);

    await expect(createAndSendMessage(username, sprintCode)).rejects.toThrow(
      'Template not found'
    );
  });
});
