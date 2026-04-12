import { PUBLIC } from '@/constant/app-routes';
import { TodosPage, FormBuilderPage, FormPreviewPage } from '@/routes/public.lazy';

interface IRoute {
  path: string;
  element: React.JSX.Element;
}

export const publicRoutes: IRoute[] = [
  {
    path: PUBLIC.TODOS,
    element: <TodosPage />,
  },
  {
    path: PUBLIC.FORM_BUILDER,
    element: <FormBuilderPage />,
  },
  {
    path: PUBLIC.FORM_PREVIEW,
    element: <FormPreviewPage />,
  },
];
