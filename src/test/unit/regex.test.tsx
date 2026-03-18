import { describe, test, expect } from 'vitest';

import { EMAIL_REGEX } from '../../constants/regex';

describe('EMAIL_REGEX', () => {
  test('accepts valid email format', () => {
    const validEmails = [
      'abc@gmail.com',
      'user123@gmail.com',
      'hello.123@mail.com',
    ];

    validEmails.forEach((email) => {
      expect(EMAIL_REGEX.test(email)).toBe(true);
    });
  });

  test('rejects invalid email format', () => {
    const invalidEmails = [
      'invalid-email',
      'abc@',
      '@gmail.com',
      'abc@gmail',
      'abc@.com',
      '',
      ' ',
      '1',
      'abcd',
    ];

    invalidEmails.forEach((email) => {
      expect(EMAIL_REGEX.test(email)).toBe(false);
    });
  });
});
