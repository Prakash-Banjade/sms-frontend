import AppRootLayout from '@/components/app-sidebar-layout/root-layout';
import RequireAuth from '@/components/auth/require-auth';

import { Role } from '@/types/global.type';
import { Route, Routes } from 'react-router-dom';
import { studentSidebarMenuItems } from './layout/sidebar-items';
import AssignmentPage from './pages/academics/assigment.page';
import HomeWorkPage from './pages/academics/homework.page';
import SubjectPlanPage from './pages/academics/subject-plan.page';
import ClassRoutinePage from './pages/academics/class-routine.page';



const StudentRoutes = () => {
  return (
    <Routes>
      <Route element={<RequireAuth authorizedRoles={[Role.STUDENT]} />}>
        <Route element={<AppRootLayout menuItems={studentSidebarMenuItems} />}>
          <Route path="dashboard" element={<div>Dashboard xa</div>} />
          <Route path="assignments" element={<AssignmentPage />} />
          <Route path="homework" element={<HomeWorkPage />} />
          <Route path="attendance" element={<AssignmentPage />} />
          <Route path="Subject-plan" element={<SubjectPlanPage />} />
          <Route path="class-routine" element={<ClassRoutinePage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default StudentRoutes;
