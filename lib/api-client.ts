type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.fetch<T>(endpoint, { method: "GET", headers });
  }

  post<T>(
    endpoint: string,
    body: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.fetch<T>(endpoint, { method: "POST", body, headers });
  }

  put<T>(
    endpoint: string,
    body: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.fetch<T>(endpoint, { method: "PUT", body, headers });
  }

  delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.fetch<T>(endpoint, { method: "DELETE", headers });
  }
}

export default ApiClient;
