import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import {
  fetchDiscordUser,
  sendMessageToDiscord,
} from '../../src/services/discordService';

jest.mock('discord.js', () => {
  const actualDiscord = jest.requireActual('discord.js');
  const mockClient = {
    channels: {
      fetch: jest.fn(),
    },
    guilds: {
      fetch: jest.fn(),
    },
    isReady: jest.fn(),
    once: jest.fn(),
    login: jest.fn(),
  };
  return {
    ...actualDiscord,
    Client: jest.fn(() => mockClient),
  };
});

describe('discordService', () => {
  const channelId = '1234567890';
  const message = 'Hello, world!';
  let clientInstance: jest.Mocked<Client>;

  beforeEach(() => {
    jest.clearAllMocks();
    clientInstance = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
      ],
    }) as jest.Mocked<Client>;
  });

  describe('fetchDiscordUser', () => {
    it('should fetch a Discord user by username', async () => {
      const mockGuild = {
        members: {
          fetch: jest.fn(),
          cache: {
            find: jest.fn().mockReturnValue({
              user: { username: 'testuser' },
            }),
          },
        },
      };
      (clientInstance.guilds.fetch as jest.Mock).mockResolvedValue(mockGuild);

      const username = 'testuser';
      const user = await fetchDiscordUser(username);

      expect(clientInstance.guilds.fetch).toHaveBeenCalledWith(
        expect.any(String)
      );
      expect(mockGuild.members.cache.find).toHaveBeenCalledWith(
        expect.any(Function)
      );
      expect(user).toBeDefined();
    });

    it('should return undefined if user is not found', async () => {
      const mockGuild = {
        members: {
          fetch: jest.fn(),
          cache: {
            find: jest.fn().mockReturnValue(undefined),
          },
        },
      };
      (clientInstance.guilds.fetch as jest.Mock).mockResolvedValue(mockGuild);

      const username = 'nonexistentuser';
      const user = await fetchDiscordUser(username);

      expect(clientInstance.guilds.fetch).toHaveBeenCalledWith(
        expect.any(String)
      );
      expect(mockGuild.members.cache.find).toHaveBeenCalledWith(
        expect.any(Function)
      );
      expect(user).toBeUndefined();
    });
  });

  describe('sendMessageToDiscord', () => {
    it('should send a message to the specified channel', async () => {
      const mockChannel = {
        send: jest.fn().mockResolvedValue(undefined),
      };
      (clientInstance.channels.fetch as jest.Mock).mockResolvedValue(
        mockChannel as unknown as TextChannel
      );

      await sendMessageToDiscord(channelId, message);

      expect(clientInstance.channels.fetch).toHaveBeenCalledWith(channelId);
      expect(mockChannel.send).toHaveBeenCalledWith(message);
    });

    it('should handle errors when sending a message', async () => {
      const error = new Error('Test error');
      const mockChannel = {
        send: jest.fn().mockRejectedValue(error),
      };
      (clientInstance.channels.fetch as jest.Mock).mockResolvedValue(
        mockChannel as unknown as TextChannel
      );

      await expect(sendMessageToDiscord(channelId, message)).rejects.toThrow(
        'Failed to send message'
      );

      expect(clientInstance.channels.fetch).toHaveBeenCalledWith(channelId);
      expect(mockChannel.send).toHaveBeenCalledWith(message);
    });
  });
});
