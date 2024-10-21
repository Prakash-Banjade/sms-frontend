import { createBrowserRouter } from 'react-router-dom';
import AdminRoutes from './apps/admin/admin-routes';
import StudentRoutes from './apps/student/student-routes';
import TeacherRoutes from './apps/teacher/teacher-routes';
import GuardianRoutes from './apps/guardian/guardian-routes';
import { Role } from './types/global.type';
import PublicRoutes from './apps/public/public-routes';

// Main router combining individual app routes
const router = createBrowserRouter([
    {
        path: '/*',
        element: <PublicRoutes />,  // Public routes will be handled inside PublicRoutes
    },
    {
        path: `/${Role.ADMIN}/*`,
        element: <AdminRoutes />,  // Admin routes will be handled inside AdminRoutes
    },
    {
        path: `/${Role.STUDENT}/*`,
        element: <StudentRoutes />,  // Student routes will be handled inside StudentRoutes
    },
    {
        path: `/${Role.TEACHER}/*`,
        element: <TeacherRoutes />,  // Teacher routes will be handled inside TeacherRoutes
    },
    {
        path: `/${Role.GUARDIAN}/*`,
        element: <GuardianRoutes />,  // Guardian routes will be handled inside GuardianRoutes
    },
]);

export default router;
