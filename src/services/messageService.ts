import { fetchRandomGif } from './gifService';
import { sendMessageToDiscord } from './discordService';
import { messageRepository } from '../repositories/messageRepository';
import { templateRepository } from '../repositories/templateRepository';
import { sprintRepository } from '../repositories/sprintRepository';
import { userRepository } from '../repositories/userRepository';
import { fetchDiscordUser } from './discordService';
import { InsertableMessage } from '../database/types';
import { mapUser } from '../utils/mapTypes/mapUser';
import { mapSprint } from '../utils/mapTypes/mapSprint';
import { mapTemplate } from '../utils/mapTypes/mapTemplate';

export async function createAndSendMessage(
  username: string,
  sprintCode: string
) {
  console.log('Starting createAndSendMessage with:', { username, sprintCode });

  const channelId = process.env.DISCORD_CHANNEL_ID;
  if (!channelId) {
    throw new Error('DISCORD_CHANNEL_ID is not set in environment variables');
  }

  let discordUser;
  try {
    console.log('Verifying user in Discord server:', username);
    discordUser = await fetchDiscordUser(username);
    if (!discordUser) {
      console.error('User not present in Discord server:', username);
    }
  } catch (error) {
    console.error('Failed to fetch members from Discord server', error);
  }

  console.log('Fetching user by username from database:', username);
  let user = await userRepository.findByUserName(username).then(mapUser);
  if (!user) {
    if (discordUser) {
      console.log('User not found in database, adding user:', username);
      user = await userRepository.create({ user_name: username }).then(mapUser);
    } else {
      console.error(
        'User not found in both Discord server and database:',
        username
      );
      throw new Error('User not found in both Discord server and database');
    }
  }

  console.log('Fetching sprint by sprintCode:', sprintCode);
  const sprint = await sprintRepository
    .findBySprintCode(sprintCode)
    .then(mapSprint);
  console.log('Fetched sprint:', JSON.stringify(sprint, null, 2));
  if (!sprint) {
    console.error('Sprint not found:', sprintCode);
    throw new Error('Sprint not found');
  }

  console.log('Fetching random template');
  const template = await templateRepository.findRandom().then(mapTemplate);
  console.log('Fetched template:', JSON.stringify(template, null, 2));
  if (!template || !template.message_template) {
    console.error('Template not found or message_template is undefined');
    throw new Error('Template not found');
  }

  console.log('Fetching random celebration GIF');
  const gifUrl = await fetchRandomGif('celebration');

  console.log('Constructing message to be sent');
  const message = `${template.message_template.replace('{username}', username).replace('{sprintTitle}', sprint.sprint_name)}\n${gifUrl}`;
  console.log('Constructed message:', message);

  console.log('Sending message to Discord');
  await sendMessageToDiscord(channelId, message);

  console.log('Storing the message record in the database');
  const newMessage: InsertableMessage = {
    user_id: user.id as unknown as number,
    template_id: template.id as unknown as number,
    sprint_id: sprint.id as unknown as number,
    timestamp: new Date().toISOString(),
  };
  await messageRepository.create(newMessage);

  console.log('Message successfully sent and stored');
}
