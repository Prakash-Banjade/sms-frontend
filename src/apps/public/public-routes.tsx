import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layout/public-layout';
import LoginPage from './pages/login.page';
import ForgotPasswordPage from './pages/forgot-password.page';

const PublicRoutes = () => {
    return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route path="/" element={<LoginPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />
            </Route>
        </Routes>
    );
};

export default PublicRoutes;
