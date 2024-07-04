import { templateRepository } from '../../src/repositories/templateRepository';
import { db } from '../../src/database';
import { mapTemplate } from '../../src/utils/mapTypes/mapTemplate';

jest.mock('../../src/database');
jest.mock('../../src/utils/mapTypes/mapTemplate');

describe('Template Repository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockTemplates = [{ id: 1, message_template: 'Hello {username}!' }];

  it('should return all templates', async () => {
    (db.selectFrom as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue(mockTemplates),
    });
    (mapTemplate as jest.Mock).mockImplementation((template) => template);

    const result = await templateRepository.findAll();
    expect(result).toEqual(mockTemplates);
    expect(db.selectFrom).toHaveBeenCalledWith('templates');
    expect(mapTemplate).toHaveBeenCalledWith(mockTemplates[0]);
  });
});
