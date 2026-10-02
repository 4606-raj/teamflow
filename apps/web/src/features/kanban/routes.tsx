import { KanbanPage } from './pages/KanbanPage';

export const kanbanRoutes = [
  {
    path: '/kanban',
    element: <KanbanPage />,
  },
  {
    path: '/projects/:projectId/kanban',
    element: <KanbanPage />,
  },
];
