import AppRootLayout from '@/components/app-sidebar-layout/root-layout';
import RequireAuth from '@/components/auth/require-auth';
import { Role } from '@/types/global.type';
import { Route, Routes } from 'react-router-dom';

const StudentRoutes = () => {
  return (
    <Routes>
      <Route element={<RequireAuth authorizedRoles={[Role.STUDENT]} />}>
        <Route element={<AppRootLayout menuItems={[]} />}>
          <Route path="dashboard" element={<div>Dashboard</div>} />
        </Route>
      </Route>
    </Routes>
  );
};

export default StudentRoutes;
