import { useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useNavigate } from 'react-router-dom';

import { PUBLIC } from '@/constant/app-routes';
import { fetchTodos } from '@/services/todo';
import { fetchUsers } from '@/services/user';
import { TODO_STATUS_FILTER } from '@/constant/todo-status';
import { useTodosViewState } from '@/hooks/useTodosViewState';
import getErrorMessage from '@/utils/get-error-message';
import Loading from '@/components/loading';
import PageMetadata from '@/components/page-metadata';
import TodosFilters from './components/filters';
import TodosTable from './components/table';
import TodosPagination from './components/pagination';

import styles from './index.module.css';

const PAGE_SIZE = 10;

const todosQueryKey = ['jsonplaceholder', 'todos'] as const;
const usersQueryKey = ['jsonplaceholder', 'users'] as const;

const Todos = () => {
  const navigate = useNavigate();
  const { state, setUserId, setStatus, setSearch, setPage } =
    useTodosViewState();

  const todosListQuery = useQuery({
    queryKey: todosQueryKey,
    queryFn: fetchTodos,
    staleTime: 60_000,
  });

  const usersListQuery = useQuery({
    queryKey: usersQueryKey,
    queryFn: fetchUsers,
    staleTime: 60_000,
  });

  const userNameById = useMemo(() => {
    const map = new Map<number, string>();
    for (const user of usersListQuery.data ?? []) {
      map.set(user.id, user.name);
    }
    return map;
  }, [usersListQuery.data]);

  const filteredTodos = useMemo(() => {
    let list = todosListQuery.data ?? [];

    if (state.userId !== null) {
      list = list.filter((todo) => todo.userId === state.userId);
    }

    if (state.status === TODO_STATUS_FILTER.COMPLETED) {
      list = list.filter((todo) => todo.completed);
    } else if (state.status === TODO_STATUS_FILTER.PENDING) {
      list = list.filter((todo) => !todo.completed);
    }

    const query = state.search.trim().toLowerCase();
    if (query) {
      list = list.filter((todo) => todo.title.toLowerCase().includes(query));
    }

    return list;
  }, [todosListQuery.data, state.userId, state.status, state.search]);

  const totalPages = Math.max(1, Math.ceil(filteredTodos.length / PAGE_SIZE));

  useEffect(() => {
    if (state.page > totalPages) {
      setPage(totalPages);
    }
  }, [state.page, totalPages, setPage]);

  const pageTodos = useMemo(() => {
    const start = (state.page - 1) * PAGE_SIZE;
    return filteredTodos.slice(start, start + PAGE_SIZE);
  }, [filteredTodos, state.page]);

  const isLoading = todosListQuery.isLoading || usersListQuery.isLoading;
  const error = todosListQuery.error ?? usersListQuery.error;
  const errorMessage = getErrorMessage(error);

  return (
    <div className={styles.wrap}>
      <PageMetadata title="Todos" />
      {isLoading && <Loading />}

      <header className={styles.top}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Todos</h1>
          <p className={styles.subtitle}>
            Filter by user and status, search titles, paginate results.
          </p>
        </div>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => navigate(PUBLIC.FORM_BUILDER)}
        >
          Form builder
        </button>
      </header>

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
          {errorMessage}
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
  );
};

export default Todos;
