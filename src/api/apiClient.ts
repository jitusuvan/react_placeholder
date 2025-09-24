/**
 * A global API client utility for making HTTP requests.
 * Uses fetch API and supports GET, POST, DELETE, PATCH methods.
 */

import { API_HOST } from "../config/apiConfig";

interface RequestOptions {
  method?: string;
  headers?: HeadersInit;
  body?: any;
}

async function request(endpoint: string, options: RequestOptions = {}) {
  const { method = "GET", headers = {}, body } = options;

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_HOST}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "API request failed");
  }

  if (response.status === 204) {
    return null; // No content
  }

  return response.json();
}

export const apiClient = {
  get: (endpoint: string, headers?: HeadersInit) => request(endpoint, { method: "GET", headers }),
  post: (endpoint: string, body: any, headers?: HeadersInit) =>
    request(endpoint, { method: "POST", body, headers }),
  patch: (endpoint: string, body: any, headers?: HeadersInit) =>
    request(endpoint, { method: "PATCH", body, headers }),
  delete: (endpoint: string, headers?: HeadersInit) => request(endpoint, { method: "DELETE", headers }),
};
