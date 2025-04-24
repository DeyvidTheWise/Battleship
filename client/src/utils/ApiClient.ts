
const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"

interface RequestOptions extends RequestInit {
  params?: Record<string, string>
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl
  }

  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>("GET", endpoint, undefined, options)
  }

  async post<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>("POST", endpoint, data, options)
  }

  async put<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>("PUT", endpoint, data, options)
  }

  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>("DELETE", endpoint, undefined, options)
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    { params, headers, ...options }: RequestOptions = {},
  ): Promise<T> {
    
    const url = new URL(endpoint, this.baseUrl)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }

    
    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }

    
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`
    }

    
    const mergedHeaders = { ...defaultHeaders, ...headers }

    
    const requestOptions: RequestInit = {
      method,
      headers: mergedHeaders,
      ...options,
    }

    
    if (data) {
      requestOptions.body = JSON.stringify(data)
    }

    const response = await fetch(url.toString(), requestOptions)

    
    const contentType = response.headers.get("content-type")
    let result: any

    if (contentType && contentType.includes("application/json")) {
      result = await response.json()
    } else {
      result = await response.text()
    }

    
    if (!response.ok) {
      const error: any = new Error(result.message || "API request failed")
      error.response = { status: response.status, data: result }
      throw error
    }

    return result as T
  }
}

export const apiClient = new ApiClient()

export default apiClient

export const api = apiClient
