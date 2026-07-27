import { describe, expect, it } from 'vitest';
import { validatePassword } from './passwordPolicy.js';

describe('validatePassword (TDD kata)', () => {
  it('accepts a strong password', () => {
    expect(validatePassword('Secret1x')).toEqual({ ok: true });
  });

  it('rejects password shorter than 8 characters', () => {
    const result = validatePassword('Ab1');
    expect(result.ok).toBe(false);
    expect(result.errors).toContain('Password must be at least 8 characters');
  });

  it('rejects password without a digit', () => {
    const result = validatePassword('Secretxx');
    expect(result.ok).toBe(false);
    expect(result.errors).toContain('Password must contain at least one digit');
  });

  it('rejects password without uppercase', () => {
    const result = validatePassword('secret1x');
    expect(result.ok).toBe(false);
    expect(result.errors).toContain('Password must contain an uppercase letter');
  });

  it('rejects password without lowercase', () => {
    const result = validatePassword('SECRET1X');
    expect(result.ok).toBe(false);
    expect(result.errors).toContain('Password must contain a lowercase letter');
  });

  it('collects multiple errors at once', () => {
    const result = validatePassword('short');
    expect(result.ok).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });
});
