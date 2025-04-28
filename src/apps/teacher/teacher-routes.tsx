import RequireAuth from '@/components/auth/require-auth';
import { ETask, Role } from '@/types/global.type';
import { Navigate, Route, Routes } from 'react-router-dom';
import { teacherSidebarMenuItems } from './layout/sidebar-items';
import AppRootLayout from '@/components/app-sidebar-layout/root-layout';
import { CommonRoutes, OnlineClassesRoutes } from '../common/common-routes';
import { lazy } from 'react';
import StreamClientProvider from './layout/stream-client-provider';
import MyClassesPage from './pages/my-classes.page';
import StudentAttendancePage from '../admin/pages/students-management/attendance/student-attendance.page';
import MyAttendancePage from '../student/pages/my-attendance.page';
import StudentsLeaveRequestsPage from '../admin/pages/students-management/attendance/leave-request.page';
import TasksPage from '../admin/pages/tasks/task-list.page';
import AddTaskPage from '../admin/pages/tasks/add-task.page';
import SingleTaskPage from '../admin/pages/tasks/single-task.page';
import EditTaskPage from '../admin/pages/tasks/edit-task.page';
import StudentsListPage from '../admin/pages/students-management/students-list.page';
import SingleStudentPage from '../admin/pages/subjects/single-student.page';
import SingleClassRoomPage from '../admin/pages/classes/single-classroom.page';
import ClassRoutinePage from '../student/pages/class-routine.page';
const MyLeaveRequestsPage = lazy(() => import('../common/pages/leave-request/my-leave-requests.page'));
const AddLeaveRequestPage = lazy(() => import('../common/pages/leave-request/add-leave-request.page'));
const OnlineClassesPage = lazy(() => import('../common/pages/online-classes/online-classes.page'));

const TeacherRoutes = () => {
  return (
    <Routes>
      <Route element={<RequireAuth authorizedRoles={[Role.TEACHER]} />}>
        <Route element={<AppRootLayout menuItems={teacherSidebarMenuItems} />}>
          <Route path="dashboard" element={<div>This is teacher dashboard</div>} />
          <Route path="my-classes" >
            <Route index element={<MyClassesPage />} />
            <Route path=":id" element={<SingleClassRoomPage />} />
          </Route>
          <Route path="students">
            <Route index element={<StudentsListPage />} />
            <Route path=":id" element={<SingleStudentPage />} />
          </Route>
          <Route path='attendance'>
            <Route index element={<StudentAttendancePage />} />
            <Route path='leave-requests' element={<StudentsLeaveRequestsPage />} />
          </Route>

          <Route path="tasks">
            <Route index element={<Navigate to="homeworks" />} />
            <Route path='homeworks'>
              <Route index element={<TasksPage type={ETask.HOMEWORK} />} />
              <Route path='new' element={<AddTaskPage type={ETask.HOMEWORK} />} />
              <Route path=":id">
                <Route index element={<SingleTaskPage type={ETask.HOMEWORK} />} />
                <Route path="edit" element={<EditTaskPage type={ETask.HOMEWORK} />} />
              </Route>
            </Route>
            <Route path='assignments'>
              <Route index element={<TasksPage type={ETask.ASSIGNMENT} />} />
              <Route path='new' element={<AddTaskPage type={ETask.ASSIGNMENT} />} />
              <Route path=":id">
                <Route index element={<SingleTaskPage type={ETask.ASSIGNMENT} />} />
                <Route path="edit" element={<EditTaskPage type={ETask.ASSIGNMENT} />} />
              </Route>
            </Route>
          </Route>

          <Route path="schedule" element={<ClassRoutinePage />} />

          <Route path="my-attendance" element={<MyAttendancePage />} />
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
