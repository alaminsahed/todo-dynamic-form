import apiClient from '@/config/axios-config'
import { ENDPOINTS } from '@/constant/api-endpoints'
import type { TodoItem } from '@/types/todo'

export const fetchTodos = (): Promise<TodoItem[]> =>
  apiClient.get<TodoItem[]>(ENDPOINTS.TODOS).then(({ data }) => data)
