import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layout/public-layout';
import LoginPage from './pages/login.page';
import ForgotPasswordPage from './pages/forgot-password.page';
import ResetPasswordPage from './pages/reset-password.page';

const PublicRoutes = () => {
    return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route index element={<Navigate to="/auth/login" />} />
                <Route path="auth">
                    <Route index element={<Navigate to="/auth/login" />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="reset-password">
                        <Route index element={<Navigate to="/auth/login" />} />
                        <Route path=":token" element={<ResetPasswordPage />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
};

export default PublicRoutes;
