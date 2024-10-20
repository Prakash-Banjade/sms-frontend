import { Route, Routes } from 'react-router-dom';
import AdminRootLayout from '../../components/app-sidebar-layout/root-layout';
import { AdminDashboard } from './pages/dashboard';
import { adminSidebarMenuItems } from './layout/sidebar-items';

const AdminRoutes = () => {
    return (
        <Routes>
            <Route element={<AdminRootLayout menuItems={adminSidebarMenuItems} />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                {/* Add more admin-specific routes */}
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
