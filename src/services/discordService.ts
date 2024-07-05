import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import 'dotenv/config';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.login(process.env.DISCORD_BOT_TOKEN);

export async function fetchDiscordUser(username: string) {
  const guildId = process.env.DISCORD_GUILD_ID;

  if (!guildId) {
    throw new Error('DISCORD_GUILD_ID is not set in environment variables');
  }

  // ensure client is ready before making any API calls
  if (!client.isReady()) {
    await new Promise<void>((resolve) => client.once('ready', () => resolve()));
  }

  const guild = await client.guilds.fetch(guildId);
  await guild.members.fetch(); // ensure all members are fetched

  const user = guild.members.cache.find(
    (member) => member.user.username === username
  );

  return user;
}

export async function sendMessageToDiscord(channelId: string, message: string) {
  const channel = (await client.channels.fetch(channelId)) as TextChannel;
  await channel.send(message);
  console.log(`Message sent to channel ${channelId}`);
}
