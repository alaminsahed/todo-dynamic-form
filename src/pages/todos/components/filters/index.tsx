import { TODO_STATUS_FILTER } from '@/constant/todo-status';
import type { StatusFilter } from '@/hooks/useTodosViewState';
import type { UserItem } from '@/types/todo';

import styles from './index.module.css';

interface Props {
  users: UserItem[];
  userId: number | null;
  status: StatusFilter;
  search: string;
  disabled: boolean;
  onUserChange: (userId: number | null) => void;
  onStatusChange: (status: StatusFilter) => void;
  onSearchChange: (search: string) => void;
}

const TodosFilters = ({
  users = [],
  userId,
  status,
  search,
  disabled,
  onUserChange,
  onStatusChange,
  onSearchChange,
}: Props) => {
  return (
    <div className={styles.toolbar}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="todos-user">
          User
        </label>
        <select
          id="todos-user"
          className={styles.select}
          value={userId === null ? '' : String(userId)}
          onChange={(e) => {
            const v = e.target.value;
            onUserChange(v === '' ? null : Number(v));
          }}
          disabled={disabled}
        >
          <option value="">All users</option>
          {users
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="todos-status">
          Status
        </label>
        <select
          id="todos-status"
          className={styles.select}
          value={status}
          onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
          disabled={disabled}
        >
          <option value={TODO_STATUS_FILTER.ALL}>All</option>
          <option value={TODO_STATUS_FILTER.PENDING}>Pending</option>
          <option value={TODO_STATUS_FILTER.COMPLETED}>Completed</option>
        </select>
      </div>

      <div className={styles.fieldGrow}>
        <label className={styles.label} htmlFor="todos-search">
          Search
        </label>
        <input
          id="todos-search"
          className={styles.input}
          type="search"
          placeholder="Filter by title…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          disabled={disabled}
          autoComplete="off"
        />
      </div>
    </div>
  );
};

export default TodosFilters;
