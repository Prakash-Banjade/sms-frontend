import { Route, Routes } from 'react-router-dom';
import { AdminDashboard } from './pages/dashboard';
import { adminSidebarMenuItems } from './layout/sidebar-items';
import RequireAuth from '@/components/auth/require-auth';
import { Role } from '@/types/global.type';
import AppRootLayout from '../../components/app-sidebar-layout/root-layout';

const AdminRoutes = () => {
    return (
        <Routes>
            <Route element={<RequireAuth authorizedRoles={[Role.ADMIN]} />}>
                <Route element={<AppRootLayout menuItems={adminSidebarMenuItems} />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    {/* Add more admin-specific routes */}
                </Route>
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
