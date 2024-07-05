import { describe, it, expect } from 'vitest';
import {
  parse,
  parseId,
  parseInsertable,
  parseUpdatable,
  keys,
} from '../../src/schemas/templateSchema';
import { Templates } from '../../src/database/types';
import { ColumnType } from 'kysely';

// Mock the Templates type
const mockTemplate: Templates = {
  id: 1 as unknown as ColumnType<number, number | undefined, number>,
  message_template: 'Test template',
};

describe('Schema and utility functions', () => {
  describe('parse', () => {
    it('should parse a valid record', () => {
      expect(parse(mockTemplate)).toEqual(mockTemplate);
    });

    it('should throw an error for an invalid record', () => {
      const invalidRecord = {
        ...mockTemplate,
        id: 0 as unknown as ColumnType<number, number | undefined, number>,
      };
      expect(() => parse(invalidRecord)).toThrow();
    });
  });

  describe('parseId', () => {
    it('should parse a valid id', () => {
      expect(parseId(1)).toBe(1);
    });

    it('should throw an error for an invalid id', () => {
      expect(() => parseId(0)).toThrow();
    });
  });

  describe('parseInsertable', () => {
    it('should parse a valid insertable record', () => {
      const insertableRecord = { message_template: 'Test template' };
      expect(parseInsertable(insertableRecord)).toEqual(insertableRecord);
    });

    it('should throw an error for an invalid insertable record', () => {
      const invalidRecord = { message_template: '' };
      expect(() => parseInsertable(invalidRecord)).toThrow();
    });
  });

  describe('parseUpdatable', () => {
    it('should parse a valid updatable record', () => {
      const updatableRecord = { message_template: 'Updated template' };
      expect(parseUpdatable(updatableRecord)).toEqual(updatableRecord);
    });

    it('should throw an error for an invalid updatable record', () => {
      const invalidRecord = {
        id: 0 as unknown as ColumnType<number, number | undefined, number>,
      };
      expect(() => parseUpdatable(invalidRecord)).toThrow();
    });
  });

  describe('keys', () => {
    it('should return the correct keys', () => {
      expect(keys).toEqual(['id', 'message_template']);
    });
  });
});
