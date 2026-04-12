import apiClient from '@/config/axios-config'
import { ENDPOINTS } from '@/constant/api-endpoints'
import type { UserItem } from '@/types/todo'

export const fetchUsers = async (): Promise<UserItem[]> => {
  const { data } = await apiClient.get<UserItem[] | unknown>(ENDPOINTS.USERS)
  if (!Array.isArray(data)) {
    throw new TypeError('Invalid users response: expected an array.')
  }
  return data as UserItem[]
}
