import type { TodoItem } from '@/types/todo'

import styles from './index.module.css'

interface Props {
  todos: TodoItem[]
  userNameById: Map<number, string>
}

const TodosTable = ({ todos, userNameById }: Props) => {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Title</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th}>User</th>
          </tr>
        </thead>
        <tbody>
          {todos.length === 0 ? (
            <tr>
              <td className={styles.td} colSpan={3}>
                <div className={styles.empty}>No todos match your filters.</div>
              </td>
            </tr>
          ) : (
            todos.map((todo) => (
              <tr key={todo.id} className={styles.tr}>
                <td className={`${styles.td} ${styles.titleCell}`}>{todo.title}</td>
                <td className={styles.td}>
                  <span className={todo.completed ? styles.badgeDone : styles.badgePending}>
                    {todo.completed ? 'Completed' : 'Pending'}
                  </span>
                </td>
                <td className={styles.td}>
                  {userNameById.get(todo.userId) ?? `User #${todo.userId}`}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default TodosTable
