import { Suspense, lazy } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom'

import { PUBLIC } from '@/constant/app-routes'
import { publicRoutes } from '@/routes/public'
import Loading from '@/components/loading'

const NotFound = lazy(() => import('@/pages/not-found'))

const AppRoutes = () => {
  const location = useLocation()

  return (
    <Suspense key={location.pathname} fallback={<Loading />}>
      <Routes>
        <Route index element={<Navigate to={PUBLIC.TODOS} replace />} />
        {publicRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
