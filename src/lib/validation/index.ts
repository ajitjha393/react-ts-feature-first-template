import { z, ZodError } from 'zod';
import { Result } from '@/lib/result';

export function validateInput<T>(schema: z.ZodSchema, data: unknown): Result<T> {
  try {
    const validated = schema.parse(data) as T;
    return Result.ok(validated);
  } catch (error) {
    if (error instanceof ZodError) {
      const message = error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('; ');
      return Result.fail<T>(new Error(`Validation error: ${message}`));
    }
    return Result.fail<T>(error instanceof Error ? error : new Error(String(error)));
  }
}

export { z };
