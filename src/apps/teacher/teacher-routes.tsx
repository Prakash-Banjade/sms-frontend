import RequireAuth from '@/components/auth/require-auth';
import { Role } from '@/types/global.type';
import { Navigate, Route, Routes } from 'react-router-dom';
import { teacherSidebarMenuItems } from './layout/sidebar-items';
import AppRootLayout from '@/components/app-sidebar-layout/root-layout';
import { CommonRoutes } from '../common/common-routes';
import MyLeaveRequestsPage from '../common/pages/leave-request/my-leave-requests.page';
import AddLeaveRequestPage from '../common/pages/leave-request/add-leave-request.page';
import LiveClassesPage from './pages/live-classes.page';
import RunningLiveClassPage from './pages/running-live-class-page';
import ClientProvider from '@/contexts/client-provider';

const TeacherRootLayout = () => {
  return (
    <ClientProvider> {/* For stream video client */}
      <AppRootLayout menuItems={teacherSidebarMenuItems} />
    </ClientProvider>
  )
}

const TeacherRoutes = () => {
  return (
    <Routes>
      <Route element={<RequireAuth authorizedRoles={[Role.TEACHER]} />}>
        <Route element={<TeacherRootLayout />}>
          <Route path="dashboard" element={<div>This is teacher dashboard</div>} />
          <Route path="leave-requests">
            <Route index element={<MyLeaveRequestsPage />} />
            <Route path="new" element={<AddLeaveRequestPage />} />
          </Route>
          <Route path="live-classes">
            <Route index element={<LiveClassesPage />} />
            <Route path="live">
              <Route index element={<Navigate to="live-classes" />} />
              <Route path=":id" element={<RunningLiveClassPage />} />
            </Route>
          </Route>
          <Route path="recorded-lectures">
            <Route index element={<div>This is recorded lectures page</div>} />
          </Route>
          {CommonRoutes()}
        </Route>
      </Route>
    </Routes>
  );
};

export default TeacherRoutes;
