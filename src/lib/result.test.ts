import { describe, it, expect } from 'vitest';
import { Result } from '@/lib/result';

describe('Result', () => {
  describe('ok', () => {
    it('should create a successful result', () => {
      const result = Result.ok(42);
      expect(result.isSuccess).toBe(true);
      expect(result.isFailure).toBe(false);
      expect(result.value).toBe(42);
    });
  });

  describe('fail', () => {
    it('should create a failed result with Error object', () => {
      const error = new Error('Something went wrong');
      const result = Result.fail<number>(error);
      expect(result.isSuccess).toBe(false);
      expect(result.isFailure).toBe(true);
      expect(result.error).toBe(error);
    });

    it('should create a failed result with string message', () => {
      const result = Result.fail<number>('Something went wrong');
      expect(result.isSuccess).toBe(false);
      expect(result.error?.message).toBe('Something went wrong');
    });
  });

  describe('map', () => {
    it('should transform success value', () => {
      const result = Result.ok(5).map((x) => x * 2);
      expect(result.isSuccess).toBe(true);
      expect(result.value).toBe(10);
    });

    it('should propagate failure', () => {
      const error = new Error('Failed');
      const result = Result.fail<number>(error).map((x) => x * 2);
      expect(result.isFailure).toBe(true);
      expect(result.error).toBe(error);
    });
  });

  describe('flatMap', () => {
    it('should chain operations on success', () => {
      const result = Result.ok(5)
        .flatMap((x) => Result.ok(x * 2))
        .flatMap((x) => Result.ok(x + 1));
      expect(result.isSuccess).toBe(true);
      expect(result.value).toBe(11);
    });

    it('should stop on first failure', () => {
      const result = Result.ok(5)
        .flatMap((x) => Result.fail<number>('Error!'))
        .flatMap(() => Result.ok(100));
      expect(result.isFailure).toBe(true);
      expect(result.error?.message).toBe('Error!');
    });
  });

  describe('getOrElse', () => {
    it('should return value on success', () => {
      const result = Result.ok(42).getOrElse(0);
      expect(result).toBe(42);
    });

    it('should return default on failure', () => {
      const result = Result.fail<number>('Error').getOrElse(0);
      expect(result).toBe(0);
    });
  });
});
