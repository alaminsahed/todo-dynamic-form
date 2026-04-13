import { useNavigate } from 'react-router-dom'

import { PUBLIC } from '@/constant/app-routes'

const FormBuilder = () => {
  const navigate = useNavigate()

  return (
    <div>
      <p>FormBuilder</p>
      <button type="button" onClick={() => navigate(PUBLIC.TODOS)}>
        Go to Todos
      </button>
    </div>
  )
}

export default FormBuilder
