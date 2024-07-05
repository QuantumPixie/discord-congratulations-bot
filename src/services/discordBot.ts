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

export async function sendMessageToDiscord(channelId: string, message: string) {
  try {
    const channel = (await client.channels.fetch(channelId)) as TextChannel;
    await channel.send(message);
    console.log(`Message sent to channel ${channelId}`);
  } catch (error) {
    console.error(`Failed to send message to channel ${channelId}:`, error);
    throw new Error(`Failed to send message`);
  }
}

client
  .login(process.env.DISCORD_BOT_TOKEN)
  .then(() => {
    console.log('Bot is online!');
  })
  .catch((error) => {
    console.error('Failed to login:', error);
  });
