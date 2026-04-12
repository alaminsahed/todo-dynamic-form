import { useMemo, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import { fetchTodos } from '@/services/todo'
import { fetchUsers } from '@/services/user'
import { useTodosViewState } from '@/hooks/useTodosViewState'
import Loading from '@/components/loading'
import TodosFilters from './components/filters'
import TodosTable from './components/table'
import TodosPagination from './components/pagination'

import styles from './index.module.css'

const PAGE_SIZE = 10

const todosQueryKey = ['jsonplaceholder', 'todos'] as const
const usersQueryKey = ['jsonplaceholder', 'users'] as const

const Todos = () => {
  const { state, setUserId, setStatus, setSearch, setPage } = useTodosViewState()

  const todosListQuery = useQuery({
    queryKey: todosQueryKey,
    queryFn: fetchTodos,
    staleTime: 60_000,
  })

  const usersListQuery = useQuery({
    queryKey: usersQueryKey,
    queryFn: fetchUsers,
    staleTime: 60_000,
  })

  const userNameById = useMemo(() => {
    const map = new Map<number, string>()
    for (const user of usersListQuery.data ?? []) {
      map.set(user.id, user.name)
    }
    return map
  }, [usersListQuery.data])

  // Memoised so filtering 200 todos only reruns when data or filter values change,
  // not on every unrelated render (e.g. typing causes multiple renders).
  const filteredTodos = useMemo(() => {
    let list = todosListQuery.data ?? []

    if (state.userId !== null) {
      list = list.filter((todo) => todo.userId === state.userId)
    }

    if (state.status === 'completed') {
      list = list.filter((todo) => todo.completed)
    } else if (state.status === 'pending') {
      list = list.filter((todo) => !todo.completed)
    }

    const query = state.search.trim().toLowerCase()
    if (query) {
      list = list.filter((todo) => todo.title.toLowerCase().includes(query))
    }

    return list
  }, [todosListQuery.data, state.userId, state.status, state.search])

  const totalPages = Math.max(1, Math.ceil(filteredTodos.length / PAGE_SIZE))

  useEffect(() => {
    if (state.page > totalPages) {
      setPage(totalPages)
    }
  }, [state.page, totalPages, setPage])

  const pageTodos = useMemo(() => {
    const start = (state.page - 1) * PAGE_SIZE
    return filteredTodos.slice(start, start + PAGE_SIZE)
  }, [filteredTodos, state.page])

  const isLoading = todosListQuery.isLoading || usersListQuery.isLoading
  const error = todosListQuery.error ?? usersListQuery.error

  return (
    <div className={styles.wrap}>
      {isLoading && <Loading />}

      <h1 className={styles.title}>Todo list</h1>
      <p className={styles.subtitle}>
        Todos from JSONPlaceholder with filters, search, and pagination. Your choices persist
        when you leave and return to this page.
      </p>

      <TodosFilters
        users={usersListQuery.data ?? []}
        userId={state.userId}
        status={state.status}
        search={state.search}
        disabled={isLoading}
        onUserChange={setUserId}
        onStatusChange={setStatus}
        onSearchChange={setSearch}
      />

      {error ? (
        <p className={styles.error} role="alert">
          Could not load todos. Please try again later.
        </p>
      ) : (
        !isLoading && (
          <>
            <TodosTable todos={pageTodos} userNameById={userNameById} />

            <TodosPagination
              page={state.page}
              totalPages={totalPages}
              totalItems={filteredTodos.length}
              pageSize={PAGE_SIZE}
              onPrev={() => setPage(state.page - 1)}
              onNext={() => setPage(state.page + 1)}
            />
          </>
        )
      )}
    </div>
  )
}

export default Todos

