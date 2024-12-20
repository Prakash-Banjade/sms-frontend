import RequireAuth from '@/components/auth/require-auth';
import { Role } from '@/types/global.type';
import { Route, Routes } from 'react-router-dom';
import AppRootLayout from '@/components/app-sidebar-layout/root-layout';
import { superAdminSidebarMenuItems } from './layout/sidebar-items';
import { AdminDashboard } from '../admin/pages/dashboard';

const SuperAdminRoutes = () => {
    return (
        <Routes>
            <Route element={<RequireAuth authorizedRoles={[Role.SUPER_ADMIN]} />}>
                <Route element={<AppRootLayout menuItems={superAdminSidebarMenuItems} />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default SuperAdminRoutes;
