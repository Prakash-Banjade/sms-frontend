import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layout/public-layout';
import LoginPage from './pages/login.page';
import ForgotPasswordPage from './pages/forgot-password.page';
import ResetPasswordPage from './pages/reset-password.page';
import ConfirmEmailPage from './pages/confirm-email.page';
import LoginChallengePage from './components/login-challenge/login-challenge.page';
import Confirm2FAOTPPage from './pages/2fa-otp-verification.page';

const PublicRoutes = () => {
    return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route index element={<Navigate to="/auth/login" />} />
                <Route path="auth">
                    <Route index element={<Navigate to="/auth/login" />} />
                    <Route path="login">
                        <Route index element={<LoginPage />} />
                        <Route path="challenge">
                            <Route index element={<LoginChallengePage />} />
                            <Route path=":token" element={<Confirm2FAOTPPage />} />
                        </Route>
                    </Route>
                    <Route path="forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="confirm-email">
                        <Route index element={<Navigate to="/auth/login" />} />
                        <Route path=":verificationToken" element={<ConfirmEmailPage />} />
                    </Route>
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
