import { describe, it, expect } from 'vitest';
import {
  parseInsertable,
  parseUpdatable,
} from '../../src/schemas/sprintSchema';

describe('Sprint Schema Tests', () => {
  const validSprint = {
    sprint_code: 'S1',
    sprint_name: 'Sprint 1',
  };

  it('should validate a correct insertable sprint', () => {
    expect(() => parseInsertable(validSprint)).not.toThrow();
  });

  it('should invalidate an incorrect insertable sprint', () => {
    const invalidSprint = { ...validSprint, sprint_code: 123 };
    expect(() => parseInsertable(invalidSprint)).toThrow();
  });

  it('should validate a correct updatable sprint', () => {
    const updatableSprint = { sprint_name: 'Updated Sprint' };
    expect(() => parseUpdatable(updatableSprint)).not.toThrow();
  });

  it('should invalidate an incorrect updatable sprint', () => {
    const invalidUpdatableSprint = { sprint_code: 123 };
    expect(() => parseUpdatable(invalidUpdatableSprint)).toThrow();
  });
});
