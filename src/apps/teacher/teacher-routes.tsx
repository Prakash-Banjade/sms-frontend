import RequireAuth from '@/components/auth/require-auth';
import { Role } from '@/types/global.type';
import { Route, Routes } from 'react-router-dom';
import { teacherSidebarMenuItems } from './layout/sidebar-items';
import AppRootLayout from '@/components/app-sidebar-layout/root-layout';
import { CommonRoutes } from '../common/common-routes';

const TeacherRoutes = () => {
  return (
    <Routes>
      <Route element={<RequireAuth authorizedRoles={[Role.TEACHER]} />}>
        <Route element={<AppRootLayout menuItems={teacherSidebarMenuItems} />}>
          <Route path="dashboard" element={<div>This is teacher dashboard</div>} />
          {/* Add more teacher-specific routes */}
          {CommonRoutes()}
        </Route>
      </Route>
    </Routes>
  );
};

export default TeacherRoutes;
