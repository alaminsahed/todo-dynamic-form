import apiClient from '@/config/axios-config';
import { ENDPOINTS } from '@/constant/api-endpoints';
import type { TodoItem } from '@/types/todo';

export const fetchTodos = async (): Promise<TodoItem[]> => {
  const { data } = await apiClient.get<TodoItem[] | unknown>(ENDPOINTS.TODOS);
  if (!Array.isArray(data)) {
    throw new TypeError('Invalid todos response: expected an array.');
  }
  return data as TodoItem[];
};
