export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export class HttpError extends Error {
  constructor(
    public statusCode: number,
    public statusText: string,
    public body: string,
  ) {
    super(`HTTP Error ${statusCode}: ${statusText} - ${body}`);
    this.name = "HttpError";
  }

  isBadRequest() {
    return this.statusCode === HTTP_STATUS.BAD_REQUEST;
  }

  isUnauthorized() {
    return this.statusCode === HTTP_STATUS.UNAUTHORIZED;
  }

  isForbidden() {
    return this.statusCode === HTTP_STATUS.FORBIDDEN;
  }

  isNotFound() {
    return this.statusCode === HTTP_STATUS.NOT_FOUND;
  }

  isConflict() {
    return this.statusCode === HTTP_STATUS.CONFLICT;
  }

  isServerError() {
    return this.statusCode >= 500;
  }
}

export function isHttpError(error: unknown): error is HttpError {
  return error instanceof HttpError;
}
