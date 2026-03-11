/**
 * Result type implementing ErrorOr pattern for railway-oriented programming
 * Inspired by the backend architecture for consistent error handling
 */

export interface IResult<T> {
  isSuccess: boolean;
  isFailure: boolean;
  value?: T;
  error?: Error;
}

export class Result<T> implements IResult<T> {
  private constructor(
    public readonly isSuccess: boolean,
    public readonly value?: T,
    public readonly error?: Error,
  ) {}

  get isFailure(): boolean {
    return !this.isSuccess;
  }

  static ok<U>(value: U): Result<U> {
    return new Result<U>(true, value);
  }

  static fail<U>(error: Error | string): Result<U> {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    return new Result<U>(false, undefined, errorObj);
  }

  static async tryAsync<U>(promise: Promise<U>): Promise<Result<U>> {
    try {
      const value = await promise;
      return Result.ok(value);
    } catch (error) {
      return Result.fail<U>(error instanceof Error ? error : new Error(String(error)));
    }
  }

  map<U>(fn: (value: T) => U): Result<U> {
    return this.isSuccess ? Result.ok(fn(this.value!)) : Result.fail<U>(this.error!);
  }

  flatMap<U>(fn: (value: T) => Result<U>): Result<U> {
    return this.isSuccess ? fn(this.value!) : Result.fail<U>(this.error!);
  }

  getOrThrow(): T {
    if (this.isSuccess) {
      return this.value!;
    }
    throw this.error;
  }

  getOrElse(defaultValue: T): T {
    return this.isSuccess ? this.value! : defaultValue;
  }
}

export type Awaitable<T> = T | Promise<T>;
