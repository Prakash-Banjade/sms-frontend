import RequireAuth from '@/components/auth/require-auth';
import { Role } from '@/types/global.type';
import { Navigate, Route, Routes } from 'react-router-dom';
import { teacherSidebarMenuItems } from './layout/sidebar-items';
import AppRootLayout from '@/components/app-sidebar-layout/root-layout';
import { CommonRoutes } from '../common/common-routes';
import { lazy } from 'react';
import StreamClientProvider from './layout/stream-client-provider';
const MyLeaveRequestsPage = lazy(() => import('../common/pages/leave-request/my-leave-requests.page'));
const AddLeaveRequestPage = lazy(() => import('../common/pages/leave-request/add-leave-request.page'));
const OnlineClassesPage = lazy(() => import('./pages/online-classes.page'));
const LiveOnlineClassPageWrapper = lazy(() => import('./pages/live-online-class-page'));
const CallLeftPage = lazy(() => import('./pages/call-left.page'));

const TeacherRoutes = () => {
  return (
    <Routes>
      <Route element={<RequireAuth authorizedRoles={[Role.TEACHER]} />}>
        <Route element={<AppRootLayout menuItems={teacherSidebarMenuItems} />}>
          <Route path="dashboard" element={<div>This is teacher dashboard</div>} />
          <Route path="leave-requests">
            <Route index element={<MyLeaveRequestsPage />} />
            <Route path="new" element={<AddLeaveRequestPage />} />
          </Route>
          <Route path="live-classes" element={<StreamClientProvider />}>
            <Route index element={<OnlineClassesPage />} />
            <Route path="live">
              <Route index element={<Navigate to="live-classes" />} />
              <Route path=":id">
                <Route index element={<LiveOnlineClassPageWrapper />} />
                <Route path='left' element={<CallLeftPage />} />
              </Route>
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
