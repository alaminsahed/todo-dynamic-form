import type { ApiError } from '@/config/axios-config'

const FALLBACK_MESSAGE = 'Something went wrong. Please try again later.'

const getErrorMessage = (error: unknown): string =>
  (error as ApiError)?.message ?? FALLBACK_MESSAGE

export default getErrorMessage
