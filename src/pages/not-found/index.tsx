import { Link } from 'react-router-dom'

import { PUBLIC } from '@/constant/app-routes'

const NotFound = () => {
  return (
    <div>
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to={PUBLIC.TODOS}>Go to Todos</Link>
    </div>
  )
}

export default NotFound
