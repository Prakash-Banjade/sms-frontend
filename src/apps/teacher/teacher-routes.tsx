import RequireAuth from '@/components/auth/require-auth';
import { Role } from '@/types/global.type';
import { Route, Routes } from 'react-router-dom';
import { teacherSidebarMenuItems } from './layout/sidebar-items';
import AppRootLayout from '@/components/app-sidebar-layout/root-layout';
import { CommonRoutes, OnlineClassesRoutes } from '../common/common-routes';
import { lazy } from 'react';
import StreamClientProvider from './layout/stream-client-provider';
const MyLeaveRequestsPage = lazy(() => import('../common/pages/leave-request/my-leave-requests.page'));
const AddLeaveRequestPage = lazy(() => import('../common/pages/leave-request/add-leave-request.page'));
const OnlineClassesPage = lazy(() => import('../common/pages/online-classes/online-classes.page'));

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
          </Route>
          {CommonRoutes()}
        </Route>
      </Route>
      {OnlineClassesRoutes()} {/* This needs to be out of regular layout */}
    </Routes>
  );
};

export default TeacherRoutes;
