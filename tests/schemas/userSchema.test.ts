import { describe, it, expect } from 'vitest';
import {
  createUserSchema,
  updateUserSchema,
} from '../../src/validators/userValidator';

describe('User Schema', () => {
  it('createUserSchema should validate correctly', () => {
    const validData = { username: 'johndoe' };
    expect(() => createUserSchema.parse(validData)).not.toThrow();

    const invalidData = { username: '' };
    expect(() => createUserSchema.parse(invalidData)).toThrow();
  });

  it('updateUserSchema should validate correctly', () => {
    const validData = { id: 1, username: 'johndoe' };
    expect(() => updateUserSchema.parse(validData)).not.toThrow();

    const invalidData = { id: null, username: '' };
    expect(() => updateUserSchema.parse(invalidData)).toThrow();
  });
});
