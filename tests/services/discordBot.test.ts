import { Client, TextChannel } from 'discord.js';
import { sendMessageToDiscord } from '@src/services/discordService';

jest.mock('discord.js', () => {
  const actual = jest.requireActual('discord.js');
  return {
    ...actual,
    Client: jest.fn().mockImplementation(() => ({
      channels: {
        fetch: jest.fn().mockResolvedValue({
          send: jest.fn().mockResolvedValue({}),
        }),
      },
      once: jest.fn(),
      login: jest.fn().mockResolvedValue('mockToken'),
    })),
  };
});

describe('discordBot', () => {
  const channelId = '1234567890';
  const message = 'Hello, Discord!';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send a message to the specified channel', async () => {
    await sendMessageToDiscord(channelId, message);

    const clientInstance = (Client as unknown as jest.Mock).mock.instances[0];
    const channel = (await clientInstance.channels.fetch(
      channelId
    )) as TextChannel;

    expect(channel.send).toHaveBeenCalledWith(message);
  });

  it('should handle errors when sending a message', async () => {
    const error = new Error('Test error');
    const clientInstance = (Client as unknown as jest.Mock).mock.instances[0];
    const channel = (await clientInstance.channels.fetch(
      channelId
    )) as TextChannel;
    (channel.send as jest.Mock).mockRejectedValueOnce(error);

    await expect(sendMessageToDiscord(channelId, message)).rejects.toThrow(
      'Failed to send message'
    );
  });
});
