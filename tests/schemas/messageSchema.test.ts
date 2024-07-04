import { parse, parseInsertable } from '@src/schemas/messageSchema';

describe('Message Schema Tests', () => {
  const validMessage = {
    id: 1,
    user_id: 1,
    template_id: 1,
    sprint_id: 1,
    timestamp: '2023-01-01T00:00:00Z',
  };

  it('should validate a correct message', () => {
    expect(() => parse(validMessage)).not.toThrow();
  });

  it('should invalidate an incorrect message', () => {
    const invalidMessage = { ...validMessage, id: -1 };
    expect(() => parse(invalidMessage)).toThrow();
  });

  it('should validate an insertable message', () => {
    const insertableMessage = { user_id: 1, template_id: 1, sprint_id: 1 };
    expect(() => parseInsertable(insertableMessage)).not.toThrow();
  });

  it('should invalidate an incorrect insertable message', () => {
    const invalidInsertableMessage = { template_id: -1 };
    expect(() => parseInsertable(invalidInsertableMessage)).toThrow();
  });
});
