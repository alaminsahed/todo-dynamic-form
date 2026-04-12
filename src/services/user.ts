import apiClient from '@/config/axios-config'
import { ENDPOINTS } from '@/constant/api-endpoints'
import type { UserItem } from '@/types/todo'

export const fetchUsers = (): Promise<UserItem[]> =>
  apiClient.get<UserItem[]>(ENDPOINTS.USERS).then(({ data }) => data)
