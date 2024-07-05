import { describe, it, expect } from 'vitest';
import { createMessageSchema } from '../../src/validators/messageValidator';
import {
  createSprintSchema,
  updateSprintSchema,
} from '../../src/validators/sprintValidator';
import {
  createTemplateSchema,
  updateTemplateSchema,
} from '../../src/validators/templateValidator';
import {
  createUserSchema,
  updateUserSchema,
} from '../../src/validators/userValidator';

describe('Validators Test', () => {
  it('createMessageSchema should validate correctly', () => {
    const validData = { username: 'johndoe', sprintCode: 'WD-1.1' };
    expect(() => createMessageSchema.parse(validData)).not.toThrow();

    const invalidData = { username: '', sprintCode: '' };
    expect(() => createMessageSchema.parse(invalidData)).toThrow();
  });

  it('createSprintSchema should validate correctly', () => {
    const validData = { sprintCode: 'S1', sprintName: 'Sprint 1' };
    expect(() => createSprintSchema.parse(validData)).not.toThrow();

    const invalidData = { sprintCode: '', sprintName: '' };
    expect(() => createSprintSchema.parse(invalidData)).toThrow();
  });

  it('updateSprintSchema should validate correctly', () => {
    const validData = { id: 1, sprintCode: 'S1', sprintName: 'Sprint 1' };
    expect(() => updateSprintSchema.parse(validData)).not.toThrow();

    const invalidData = { id: '', sprintCode: '', sprintName: '' };
    expect(() => updateSprintSchema.parse(invalidData)).toThrow();
  });

  it('createTemplateSchema should validate correctly', () => {
    const validData = { messageTemplate: 'Hello {username}!' };
    expect(() => createTemplateSchema.parse(validData)).not.toThrow();

    const invalidData = { messageTemplate: '' };
    expect(() => createTemplateSchema.parse(invalidData)).toThrow();
  });

  it('updateTemplateSchema should validate correctly', () => {
    const validData = { id: 1, messageTemplate: 'Hello {username}!' };
    expect(() => updateTemplateSchema.parse(validData)).not.toThrow();

    const invalidData = { id: '', messageTemplate: '' };
    expect(() => updateTemplateSchema.parse(invalidData)).toThrow();
  });

  it('createUserSchema should validate correctly', () => {
    const validData = { username: 'johndoe' };
    expect(() => createUserSchema.parse(validData)).not.toThrow();

    const invalidData = { username: '' };
    expect(() => createUserSchema.parse(invalidData)).toThrow();
  });

  it('updateUserSchema should validate correctly', () => {
    const validData = { id: 1, username: 'johndoe' };
    expect(() => updateUserSchema.parse(validData)).not.toThrow();

    const invalidData = { id: '', username: '' };
    expect(() => updateUserSchema.parse(invalidData)).toThrow();
  });
});
