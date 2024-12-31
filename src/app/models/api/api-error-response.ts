export class ApiErrorResponse {

  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  errors: string[];

  constructor(data: Partial<ApiErrorResponse> = {}) {
    this.timestamp = data.timestamp || new Date().toISOString();
    this.status = data.status || 0;
    this.error = data.error || 'Unknown Error';
    this.message = data.message || 'No error message provided';
    this.path = data.path || 'Unknown';
    this.errors = data.errors || [];
  }
}
