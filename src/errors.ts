export class MemoryError extends Error {
  readonly status: number;
  readonly errorType: string;
  readonly code: string;
  readonly requestId: string | undefined;
  readonly details: Record<string, unknown> | undefined;

  constructor(args: {
    status: number;
    errorType: string;
    code: string;
    message: string;
    requestId?: string;
    details?: Record<string, unknown>;
  }) {
    super(args.message);
    this.name = this.constructor.name;
    this.status = args.status;
    this.errorType = args.errorType;
    this.code = args.code;
    this.requestId = args.requestId;
    this.details = args.details;
  }
}

export class BadRequest extends MemoryError {}
export class Unauthorized extends MemoryError {}
export class Forbidden extends MemoryError {}
export class MemoryNotFound extends MemoryError {}
export class Conflict extends MemoryError {}
export class Unprocessable extends MemoryError {}
export class ServerError extends MemoryError {}

export class RateLimited extends MemoryError {
  readonly retryAfter: number | undefined;

  constructor(args: ConstructorParameters<typeof MemoryError>[0] & { retryAfter?: number }) {
    super(args);
    this.retryAfter = args.retryAfter;
  }
}

export function errorForStatus(
  status: number,
  body: { type?: string; code?: string; message?: string; details?: Record<string, unknown> } | null,
  requestId: string | undefined,
  retryAfter?: number,
): MemoryError {
  const args = {
    status,
    errorType: body?.type ?? "api_error",
    code: body?.code ?? "unknown_error",
    message: body?.message ?? `Memory API request failed with status ${status}`,
    requestId,
    details: body?.details,
  };
  if (status === 400) return new BadRequest(args);
  if (status === 401) return new Unauthorized(args);
  if (status === 403) return new Forbidden(args);
  if (status === 404) return new MemoryNotFound(args);
  if (status === 409) return new Conflict(args);
  if (status === 422) return new Unprocessable(args);
  if (status === 429) return new RateLimited({ ...args, retryAfter });
  if (status >= 500) return new ServerError(args);
  return new MemoryError(args);
}
