import { sprintRepository } from '../../src/repositories/sprintRepository';
import { db } from '../../src/database';
import { mapSprint } from '../../src/utils/mapTypes/mapSprint';

jest.mock('../../src/database');
jest.mock('../../src/utils/mapTypes/mapSprint');

describe('Sprint Repository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockSprints = [{ id: 1, sprint_code: 'S1', sprint_name: 'Sprint 1' }];

  it('should return all sprints', async () => {
    (db.selectFrom as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue(mockSprints),
    });
    (mapSprint as jest.Mock).mockImplementation((sprint) => sprint);

    const result = await sprintRepository.findAll();
    expect(result).toEqual(mockSprints);
    expect(db.selectFrom).toHaveBeenCalledWith('sprints');
    expect(mapSprint).toHaveBeenCalledWith(mockSprints[0]);
  });
});
