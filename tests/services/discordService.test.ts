import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import {
  fetchDiscordUser,
  sendMessageToDiscord,
} from '../../src/services/discordService';
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('discord.js', async () => {
  const actualDiscord =
    await vi.importActual<typeof import('discord.js')>('discord.js');
  const mockClient = {
    channels: {
      fetch: vi.fn(),
    },
    guilds: {
      fetch: vi.fn(),
    },
    isReady: vi.fn().mockReturnValue(true),
    once: vi.fn(),
    login: vi.fn(),
  };
  return {
    ...actualDiscord,
    Client: vi.fn(() => mockClient),
  };
});

describe('discordService', () => {
  const channelId = '1234567890';
  const message = 'Hello, world!';
  let clientInstance: vi.Mocked<Client>;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.DISCORD_GUILD_ID = 'mock-guild-id';
    clientInstance = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
      ],
    }) as unknown as vi.Mocked<Client>;
  });

  describe('fetchDiscordUser', () => {
    it('should fetch a Discord user by username', async () => {
      const mockGuild = {
        members: {
          fetch: vi.fn(),
          cache: {
            find: vi.fn().mockReturnValue({
              user: { username: 'testuser' },
            }),
          },
        },
      };
      clientInstance.guilds.fetch.mockResolvedValue(mockGuild);

      const username = 'testuser';
      const user = await fetchDiscordUser(username);

      expect(clientInstance.guilds.fetch).toHaveBeenCalledWith(
        process.env.DISCORD_GUILD_ID
      );
      expect(mockGuild.members.cache.find).toHaveBeenCalledWith(
        expect.any(Function)
      );
      expect(user).toBeDefined();
    });

    it('should return undefined if user is not found', async () => {
      const mockGuild = {
        members: {
          fetch: vi.fn(),
          cache: {
            find: vi.fn().mockReturnValue(undefined),
          },
        },
      };
      clientInstance.guilds.fetch.mockResolvedValue(mockGuild);

      const username = 'nonexistentuser';
      const user = await fetchDiscordUser(username);

      expect(clientInstance.guilds.fetch).toHaveBeenCalledWith(
        process.env.DISCORD_GUILD_ID
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
        send: vi.fn().mockResolvedValue(undefined),
      };
      clientInstance.channels.fetch.mockResolvedValue(
        mockChannel as unknown as TextChannel
      );

      await sendMessageToDiscord(channelId, message);

      expect(clientInstance.channels.fetch).toHaveBeenCalledWith(channelId);
      expect(mockChannel.send).toHaveBeenCalledWith(message);
    });

    it('should handle errors when sending a message', async () => {
      const error = new Error('Test error');
      const mockChannel = {
        send: vi.fn().mockRejectedValue(error),
      };
      clientInstance.channels.fetch.mockResolvedValue(
        mockChannel as unknown as TextChannel
      );

      await expect(sendMessageToDiscord(channelId, message)).rejects.toThrow(
        'Test error'
      );

      expect(clientInstance.channels.fetch).toHaveBeenCalledWith(channelId);
      expect(mockChannel.send).toHaveBeenCalledWith(message);
    });
  });
});
