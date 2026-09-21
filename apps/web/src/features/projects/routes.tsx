import Projects from './pages/Projects';
import CreateProjects from './pages/CreateProject';

export const projectRoutes = [
    {
        path: '/projects',
        element: <Projects />,
    },
    {
        path: '/projects/create',
        element: <CreateProjects />,
    },
];
