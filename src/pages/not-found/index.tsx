import { Link, useNavigate } from 'react-router-dom'

import { PUBLIC } from '@/constant/app-routes'
import styles from './index.module.css'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <span className={styles.code}>404</span>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.description}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className={styles.actions}>
        <Link to={PUBLIC.TODOS} className={styles.btnPrimary}>
          Go to Todos
        </Link>
        <button className={styles.btnSecondary} onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    </div>
  )
}

export default NotFound
