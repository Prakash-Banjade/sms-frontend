import { Route, Routes } from 'react-router-dom';
import AdminRootLayout from './layout/root-layout';
import { AdminDashboard } from './pages/dashboard';

const AdminRoutes = () => {
    return (
        <Routes>
            <Route element={<AdminRootLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                {/* Add more admin-specific routes */}
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
