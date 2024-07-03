import { describe, it, expect, vi } from 'vitest';
import { createAndSendMessage } from './messageService';
import { userRepository } from '../repositories/userRepository';
import { sprintRepository } from '../repositories/sprintRepository';
import { templateRepository } from '../repositories/templateRepository';
import { fetchRandomGif } from './gifService';
import { sendMessageToDiscord } from './discordBot';
import { faker } from '@faker-js/faker';
import { Generated } from '../database/types';
import { Sprints, Users, Templates } from '../database/types';

// Mock the dependencies
vi.mock('../repositories/userRepository');
vi.mock('../repositories/sprintRepository');
vi.mock('../repositories/templateRepository');
vi.mock('./gifService');
vi.mock('./discordBot');

function toGenerated<T>(value: T): Generated<T> {
  return value as Generated<T>;
}

const createMockUser = (): Users => ({
  id: toGenerated(faker.number.int()),
  user_name: faker.internet.userName(),
});

const createMockSprint = (): Sprints => ({
  id: toGenerated(faker.number.int()),
  sprint_code: faker.string.alphanumeric(5),
  sprint_name: faker.word.words(3),
});

const createMockTemplate = (): Templates => ({
  id: toGenerated(faker.number.int()),
  message: faker.lorem.sentence(),
});

describe('createAndSendMessage', () => {
  it('should send a message when all data is valid', async () => {
    vi.mocked(userRepository.findByUserName).mockResolvedValue(
      createMockUser()
    );
    vi.mocked(sprintRepository.findBySprintCode).mockResolvedValue(
      createMockSprint()
    );
    vi.mocked(templateRepository.findRandom).mockResolvedValue(
      createMockTemplate()
    );
    vi.mocked(fetchRandomGif).mockResolvedValue(faker.image.url());
    vi.mocked(sendMessageToDiscord).mockResolvedValue();

    const username = faker.internet.userName();
    const sprintCode = faker.string.alphanumeric(5);

    await createAndSendMessage(username, sprintCode);

    expect(sendMessageToDiscord).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('You did it!')
    );
  });

  it('should handle missing user', async () => {
    vi.mocked(userRepository.findByUserName).mockResolvedValue(undefined);
    vi.mocked(sprintRepository.findBySprintCode).mockResolvedValue(
      createMockSprint()
    );
    vi.mocked(templateRepository.findRandom).mockResolvedValue(
      createMockTemplate()
    );
    vi.mocked(fetchRandomGif).mockResolvedValue(faker.image.url());
    vi.mocked(sendMessageToDiscord).mockResolvedValue();

    const username = faker.internet.userName();
    const sprintCode = faker.string.alphanumeric(5);

    await expect(createAndSendMessage(username, sprintCode)).rejects.toThrow(
      'User not found'
    );
  });

  it('should handle missing sprint', async () => {
    vi.mocked(userRepository.findByUserName).mockResolvedValue(
      createMockUser()
    );
    vi.mocked(sprintRepository.findBySprintCode).mockResolvedValue(undefined);
    vi.mocked(templateRepository.findRandom).mockResolvedValue(
      createMockTemplate()
    );
    vi.mocked(fetchRandomGif).mockResolvedValue(faker.image.url());
    vi.mocked(sendMessageToDiscord).mockResolvedValue();

    const username = faker.internet.userName();
    const sprintCode = faker.string.alphanumeric(5);

    await expect(createAndSendMessage(username, sprintCode)).rejects.toThrow(
      'Sprint not found'
    );
  });

  it('should handle missing template', async () => {
    vi.mocked(userRepository.findByUserName).mockResolvedValue(
      createMockUser()
    );
    vi.mocked(sprintRepository.findBySprintCode).mockResolvedValue(
      createMockSprint()
    );
    vi.mocked(templateRepository.findRandom).mockResolvedValue(undefined);
    vi.mocked(fetchRandomGif).mockResolvedValue(faker.image.url());
    vi.mocked(sendMessageToDiscord).mockResolvedValue();

    const username = faker.internet.userName();
    const sprintCode = faker.string.alphanumeric(5);

    await expect(createAndSendMessage(username, sprintCode)).rejects.toThrow(
      'Template not found'
    );
  });

  it('should handle fetch random gif error', async () => {
    vi.mocked(userRepository.findByUserName).mockResolvedValue(
      createMockUser()
    );
    vi.mocked(sprintRepository.findBySprintCode).mockResolvedValue(
      createMockSprint()
    );
    vi.mocked(templateRepository.findRandom).mockResolvedValue(
      createMockTemplate()
    );
    vi.mocked(fetchRandomGif).mockRejectedValue(
      new Error('Failed to fetch gif')
    );
    vi.mocked(sendMessageToDiscord).mockResolvedValue();

    const username = faker.internet.userName();
    const sprintCode = faker.string.alphanumeric(5);

    await expect(createAndSendMessage(username, sprintCode)).rejects.toThrow(
      'Failed to fetch gif'
    );
  });

  it('should handle send message to discord error', async () => {
    vi.mocked(userRepository.findByUserName).mockResolvedValue(
      createMockUser()
    );
    vi.mocked(sprintRepository.findBySprintCode).mockResolvedValue(
      createMockSprint()
    );
    vi.mocked(templateRepository.findRandom).mockResolvedValue(
      createMockTemplate()
    );
    vi.mocked(fetchRandomGif).mockResolvedValue(faker.image.url());
    vi.mocked(sendMessageToDiscord).mockRejectedValue(
      new Error('Failed to send message')
    );

    const username = faker.internet.userName();
    const sprintCode = faker.string.alphanumeric(5);

    await expect(createAndSendMessage(username, sprintCode)).rejects.toThrow(
      'Failed to send message'
    );
  });
});
