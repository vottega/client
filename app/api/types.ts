export class APIError extends Error {
  constructor(
    public message: string,
    public status: number,
    public data?: any,
  ) {
    super(message);
    this.name = "APIError";
  }
}

// response type
export interface APIErrorResponse {
  error: string;
  path: string;
  status: number;
  timestamp: string;
}
