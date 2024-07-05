import { describe, it, expect, vi, afterEach } from 'vitest';
import { sprintRepository } from '../../src/repositories/sprintRepository';
import { db } from '../../src/database';
import { mapSprint } from '../../src/utils/mapTypes/mapSprint';

vi.mock('../../src/database');
vi.mock('../../src/utils/mapTypes/mapSprint');

describe('Sprint Repository', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockSprints = [{ id: 1, sprint_code: 'S1', sprint_name: 'Sprint 1' }];

  it('should return all sprints', async () => {
    (db.selectFrom as unknown as vi.Mock).mockReturnValue({
      selectAll: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValue(mockSprints),
    });
    (mapSprint as unknown as vi.Mock).mockImplementation(
      (sprint: any) => sprint
    );

    const result = await sprintRepository.findAll();
    expect(result).toEqual(mockSprints);
    expect(db.selectFrom).toHaveBeenCalledWith('sprints');
    expect(mapSprint).toHaveBeenCalledWith(mockSprints[0], 0, mockSprints);
  });
});
