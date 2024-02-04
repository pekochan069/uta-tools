

/** Represents a failed computation.*/
export interface Err<T, E> {
  ok: false;
  error: E;
  /*** Returns the value of the Result if it is successful, otherwise throws an error.*/
  unwrap(): T;
  /*** Returns the value of the Result if it is successful, otherwise returns the provided default value.*/
  unwrapOr(defaultValue: T): T;
  /*** Returns the value of the Result if it is successful, otherwise calls the provided function with the error and returns its result.*/
  unwrapOrElse(fn: (error: E) => T): T;
  /*** Returns true if the Result is an error, false otherwise.*/
  isErr(this: Result<T, E>): this is Err<T, E>;
  /*** Returns true if the Result is successful, false otherwise.*/
  isOk(this: Result<T, E>): this is Ok<T, E>;
}

/** Represents a successful computation.*/
export interface Ok<T, E> {
  ok: true;
  value: T;
  /*** Returns the value of the Result.*/
  unwrap(): T;
  /*** Returns the value of the Result.*/
  unwrapOr(defaultValue: T): T;
  /*** Returns the value of the Result.*/
  unwrapOrElse(fn: (error: E) => T): T;
  /*** Returns true if the Result is an error, false otherwise.*/
  isErr(this: Result<T, E>): this is Err<T, E>;
  /*** Returns true if the Result is successful, false otherwise.*/
  isOk(this: Result<T, E>): this is Ok<T, E>;
}

export type Result<T, E = Error> = Err<T, E> | Ok<T, E>;

/** Creates a successful Result with the given value.
 * @param value The value of the successful computation.
 * @returns A Result with the 'ok' type and the provided value.*/
export function Ok<T, E>(value: T): Result<T, E> {
  return {
    ok: true,
    value,
    unwrap: () => value,
    unwrapOr: () => value,
    unwrapOrElse: () => value,
    isErr: () => false,
    isOk: () => true,
  } as Ok<T, E>;
}

/**
 * Creates a failed Result with the given error.
 * @param error The error that caused the computation to fail.
 * @returns A Result with the 'error' type and the provided error.
 */
export function Err<T, E>(error: E): Result<T, E> {
  return {
    ok: false,
    error,
    unwrap: () => {
      throw error;
    },
    unwrapOr: (defaultValue: T) => defaultValue,
    unwrapOrElse: (fn: (error: E) => T) => fn(error),
    isErr: () => true,
    isOk: () => false,
  } as Err<T, E>;
}

export interface Some<T> {
  ok: true;
  value: T;
  /*** Returns the value of the Maybe if it exists, otherwise throws an error.*/
  unwrap(): T;
  /*** Returns the value of the Maybe if it exists, otherwise returns the provided default value.*/
  unwrapOr(defaultValue: T): T;
  /*** Returns the value of the Maybe if it exists, otherwise calls the provided function and returns its result.*/
  unwrapOrElse(fn: () => T): T;
  /*** Returns true if the Maybe contains a value, false otherwise.*/
  isSome(this: Maybe<T>): this is Some<T>;
  /*** Returns true if the Maybe does not contain a value, false otherwise.*/
  isNone(this: Maybe<T>): this is None;
}

export interface None {
  ok: false;
  /*** Throws an error because None does not contain a value.*/
  unwrap(): never;
  /*** Returns the provided default value because None does not contain a value.*/
  unwrapOr<T>(defaultValue: T): T;
  /*** Calls the provided function and returns its result because None does not contain a value.*/
  unwrapOrElse<T>(fn: () => T): T;
  /*** Returns true if the Maybe contains a value, false otherwise.*/
  isSome<T>(this: Maybe<T>): this is Some<T>;
  /*** Returns true if the Maybe does not contain a value, false otherwise.*/
  isNone<T>(this: Maybe<T>): this is None;
}

export type Maybe<T> = Some<T> | None;

/**
 * Creates a Some object that contains the provided value
 * @param value The value to wrap in a Maybe object
 * @returns An Maybe object that contains the some type and provided value
 */
export function Some<T>(value: T): Some<T> {
  return {
    ok: true,
    value,
    unwrap() {
      return value;
    },
    unwrapOr() {
      return value;
    },
    unwrapOrElse() {
      return value;
    },
    isSome() {
      return true;
    },
    isNone() {
      return false;
    },
  };
}

/**
 * Creates a None object
 * @returns An Maybe object that contains the none type
 */
export function None(): None {
  return {
    ok: false,
    unwrap() {
      throw new Error("Cannot unwrap None");
    },
    unwrapOr<T>(defaultValue: T) {
      return defaultValue;
    },
    unwrapOrElse<T>(fn: () => T) {
      return fn();
    },
    isSome() {
      return false;
    },
    isNone() {
      return true;
    },
  };
}

Object.freeze(None);
