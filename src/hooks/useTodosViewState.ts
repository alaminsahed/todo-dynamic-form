import { useQueryClient, useQuery } from '@tanstack/react-query'
import { TODO_STATUS_FILTER } from '@/constant/todo-status'

export type StatusFilter = (typeof TODO_STATUS_FILTER)[keyof typeof TODO_STATUS_FILTER]

export interface TodosViewState {
  userId: number | null
  status: StatusFilter
  search: string
  page: number
}

export const FILTER_QUERY_KEY = ['todos-view-state'] as const

export const defaultViewState: TodosViewState = {
  userId: null,
  status: TODO_STATUS_FILTER.ALL,
  search: '',
  page: 1,
}

export const useTodosViewState = () => {
  const queryClient = useQueryClient()

  const { data: state = defaultViewState } = useQuery<TodosViewState>({
    queryKey: FILTER_QUERY_KEY,
    queryFn: () => defaultViewState,
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: false,
  })

  const update = (patch: Partial<TodosViewState>) =>
    queryClient.setQueryData<TodosViewState>(FILTER_QUERY_KEY, (prev) => ({
      ...(prev ?? defaultViewState),
      ...patch,
    }))

  const setUserId = (userId: number | null) => update({ userId, page: 1 })
  const setStatus = (status: StatusFilter) => update({ status, page: 1 })
  const setSearch = (search: string) => update({ search, page: 1 })
  const setPage = (page: number) => update({ page: Math.max(1, page) })

  return { state, setUserId, setStatus, setSearch, setPage }
}
