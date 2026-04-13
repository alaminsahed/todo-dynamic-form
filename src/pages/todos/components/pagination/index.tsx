import styles from './index.module.css'

interface Props {
  page: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPrev: () => void
  onNext: () => void
}

const TodosPagination = ({ page, totalPages, totalItems, pageSize, onPrev, onNext }: Props) => {
  const rangeLabel =
    totalItems === 0
      ? '0'
      : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, totalItems)}`

  return (
    <div className={styles.pagination}>
      <span className={styles.summary}>
        Showing <strong className={styles.summaryStrong}>{rangeLabel}</strong> of{' '}
        <strong className={styles.summaryStrong}>{totalItems}</strong>{' '}
        {totalItems === 1 ? 'todo' : 'todos'}
      </span>
      <div className={styles.actions}>
        <button type="button" className={styles.btn} disabled={page <= 1} onClick={onPrev}>
          Previous
        </button>
        <span className={styles.pageChip}>
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          className={styles.btn}
          disabled={page >= totalPages}
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default TodosPagination
