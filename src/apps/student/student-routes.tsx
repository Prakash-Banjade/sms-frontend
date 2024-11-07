import AppRootLayout from '@/components/app-sidebar-layout/root-layout';
import RequireAuth from '@/components/auth/require-auth';
import { Role } from '@/types/global.type';
import { Route, Routes } from 'react-router-dom';
import { studentSidebarMenuItems } from './layout/sidebar-items';
import AssignmentPage from './pages/academics/assigment.page';
import HomeWorkPage from './pages/academics/homework.page';
import StudentAttendenceListPage from './pages/academics/attendence.page';
import ClassRoutineListPage from '../admin/pages/class-routine/class-routine-list.page';
import LeaveRequestPage from './pages/academics/leave-request.page';
import NoticePage from './pages/notice.page';


const StudentRoutes = () => {
  return (
    <Routes>
      <Route element={<RequireAuth authorizedRoles={[Role.STUDENT]} />}>
        <Route element={<AppRootLayout menuItems={studentSidebarMenuItems} />}>
          <Route path="dashboard" element={<div>Dashboard xa</div>} />
          <Route path="assignments" element={<AssignmentPage />} />
          <Route path="homework" element={<HomeWorkPage />} />
          <Route path="attendance" element={<StudentAttendenceListPage />} />
          <Route path="class-routine" element={<ClassRoutineListPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default StudentRoutes;
