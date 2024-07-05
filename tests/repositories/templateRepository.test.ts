import { describe, it, expect, beforeEach, vi } from 'vitest';
import { templateRepository } from '../../src/repositories/templateRepository';
import { db } from '../../src/database';
import { mapTemplate } from '../../src/utils/mapTypes/mapTemplate';

vi.mock('../../src/database');
vi.mock('../../src/utils/mapTypes/mapTemplate');

describe('Template Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockTemplates = [{ id: 1, message_template: 'Hello {username}!' }];

  it('should return all templates', async () => {
    (db.selectFrom as vi.Mock).mockReturnValue({
      selectAll: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValue(mockTemplates),
    });
    (mapTemplate as vi.Mock).mockImplementation((template: any) => template);

    const result = await templateRepository.findAll();
    expect(result).toEqual(mockTemplates);
    expect(db.selectFrom).toHaveBeenCalledWith('templates');
    expect(mapTemplate).toHaveBeenCalledWith(
      mockTemplates[0],
      0,
      mockTemplates
    );
  });
});
