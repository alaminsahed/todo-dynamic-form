import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'todo-dynamic-form:todos-view'

export type StatusFilter = 'all' | 'completed' | 'pending'

export interface TodosViewState {
  userId: number | null
  status: StatusFilter
  search: string
  page: number
}

const defaultState: TodosViewState = {
  userId: null,
  status: 'all',
  search: '',
  page: 1,
}

function loadState(): TodosViewState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState
    const parsed = JSON.parse(raw) as Partial<TodosViewState>
    return {
      ...defaultState,
      ...parsed,
      userId:
        parsed.userId === null || parsed.userId === undefined
          ? null
          : Number(parsed.userId),
      page: Math.max(1, Number(parsed.page) || 1),
    }
  } catch {
    return defaultState
  }
}

export function useTodosViewState() {
  const [state, setState] = useState<TodosViewState>(loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const setUserId = useCallback((userId: number | null) => {
    setState((s) => ({ ...s, userId, page: 1 }))
  }, [])

  const setStatus = useCallback((status: StatusFilter) => {
    setState((s) => ({ ...s, status, page: 1 }))
  }, [])

  const setSearch = useCallback((search: string) => {
    setState((s) => ({ ...s, search, page: 1 }))
  }, [])

  const setPage = useCallback((page: number) => {
    setState((s) => ({ ...s, page: Math.max(1, page) }))
  }, [])

  return { state, setUserId, setStatus, setSearch, setPage }
}
