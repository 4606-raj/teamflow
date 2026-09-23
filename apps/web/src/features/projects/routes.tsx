import Projects from './pages/Projects';
import CreateProjects from './pages/CreateProject';
import EditProjects from './pages/EditProject';

export const projectRoutes = [
    {
        path: '/projects',
        element: <Projects />,
    },
    {
        path: '/projects/create',
        element: <CreateProjects />,
    },
    {
        path: '/projects/:projectId/edit',
        element: <EditProjects />,
    },
];
