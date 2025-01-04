import { createBrowserRouter } from 'react-router-dom';
import AdminRoutes from './apps/admin/admin-routes';
import StudentRoutes from './apps/student/student-routes';
import TeacherRoutes from './apps/teacher/teacher-routes';
import { Role } from './types/global.type';
import PublicRoutes from './apps/public/public-routes';
import PersistLogin from './components/auth/persist-login';
import SuperAdminRoutes from './apps/super_admin/super_admin-routes';
import { UserRoutes } from './apps/common/common-routes';

const router = createBrowserRouter([
    {
        element: <PersistLogin />,
        children: [
            {
                path: '/*',
                element: <PublicRoutes />,  // Public routes will be handled inside PublicRoutes
            },
            {
                path: `/${Role.USER}/*`,
                element: <UserRoutes />,  // Common routes without any layout
            },
            {
                path: `/${Role.SUPER_ADMIN}/*`,
                element: <SuperAdminRoutes />,
            },
            {
                path: `/${Role.ADMIN}/*`,
                element: <AdminRoutes />,
            },
            {
                path: `/${Role.STUDENT}/*`,
                element: <StudentRoutes />,  // Student routes will be handled inside StudentRoutes
            },
            {
                path: `/${Role.TEACHER}/*`,
                element: <TeacherRoutes />,  // Teacher routes will be handled inside TeacherRoutes
            }
        ]
    }
]);

export default router;
