import axios, { AxiosError } from 'axios'

export interface ApiError {
  message: string
  status?: number
  isNetworkError: boolean
}

const HTTP_STATUS_MESSAGES: Record<number, string> = {
  400: 'Bad request. Please check your input.',
  401: 'Unauthorized. Please log in again.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  422: 'Validation failed. Please check your input.',
  429: 'Too many requests. Please slow down.',
  500: 'Server error. Please try again later.',
  502: 'Bad gateway. Please try again later.',
  503: 'Service unavailable. Please try again later.',
}

export function extractApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>

    if (axios.isCancel(axiosError)) {
      return { message: 'Request was cancelled.', isNetworkError: false }
    }

    if (!axiosError.response) {
      return {
        message:
          axiosError.code === 'ECONNABORTED'
            ? 'Request timed out. Please try again.'
            : 'Network error. Please check your connection.',
        isNetworkError: true,
      }
    }

    const status = axiosError.response.status
    const serverMessage = axiosError.response.data?.message

    return {
      message: serverMessage ?? HTTP_STATUS_MESSAGES[status] ?? `Unexpected error (${status}).`,
      status,
      isNetworkError: false,
    }
  }

  return { message: 'An unexpected error occurred.', isNetworkError: false }
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

instance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
)

instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(error),
)

export default instance
