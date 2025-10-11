import { lazy } from 'react';
import RequireAuth from '@/components/auth/require-auth';
import { ETask, Role } from '@/types/global.type';
import { Navigate, Route, Routes } from 'react-router-dom';
import { teacherSidebarMenuItems } from './layout/sidebar-items';
import AppRootLayout from '@/components/app-sidebar-layout/root-layout';
import { CommonRoutes, OnlineClassesRoutes } from '../common/common-routes';
import StreamClientProvider from './layout/stream-client-provider';
const LibraryBooksPage = lazy(() => import("../common/pages/library-books/library-books.page"));
const SingleLibraryBookPage = lazy(() => import('../admin/pages/library/single-library-book.page'));
const MyLibraryDetailsPage = lazy(() => import('../common/pages/library-books/my-library-details.page'));
const MyClassesPage = lazy(() => import('./pages/my-classes.page'));
const StudentAttendancePage = lazy(() => import('../admin/pages/students-management/attendance/student-attendance.page'));
const MyAttendancePage = lazy(() => import('../student/pages/my-attendance.page'));
const StudentsLeaveRequestsPage = lazy(() => import('../admin/pages/students-management/attendance/leave-request.page'));
const TasksPage = lazy(() => import('../admin/pages/tasks/task-list.page'));
const AddTaskPage = lazy(() => import('../admin/pages/tasks/add-task.page'));
const SingleTaskPage = lazy(() => import('../admin/pages/tasks/single-task.page'));
const EditTaskPage = lazy(() => import('../admin/pages/tasks/edit-task.page'));
const StudentsListPage = lazy(() => import('../admin/pages/students-management/students-list.page'));
const SingleStudentPage = lazy(() => import('../admin/pages/students-management/single-student.page'));
const SingleClassRoomPage = lazy(() => import('../admin/pages/classes/single-classroom.page'));
const ClassRoutinePage = lazy(() => import('../student/pages/class-routine.page'));
const MySalaryPage = lazy(() => import('./pages/my-salary.page'));
const TeacherDashboardPage = lazy(() => import('./pages/teacher-dashboard.page'));
const LessonPlansListPage = lazy(() => import('./pages/lesson-plan/lesson-plans-list.page'));
const AddLessonPlanPage = lazy(() => import('./pages/lesson-plan/add-lesson-plan.page'));
const SingleLessonPlanPage = lazy(() => import('./pages/lesson-plan/single-lesson-plan.page'));
const EditLessonPlanPage = lazy(() => import('./pages/lesson-plan/edit-lesson-plan.page'));
const MyLeaveRequestsPage = lazy(() => import('../common/pages/leave-request/my-leave-requests.page'));
const AddLeaveRequestPage = lazy(() => import('../common/pages/leave-request/add-leave-request.page'));
const OnlineClassesPage = lazy(() => import('../common/pages/online-classes/online-classes.page'));

const TeacherRoutes = () => {
  return (
    <Routes>
      <Route element={<RequireAuth authorizedRoles={[Role.TEACHER]} />}>
        <Route element={<AppRootLayout menuItems={teacherSidebarMenuItems} />}>
          <Route path="dashboard" element={<TeacherDashboardPage />} />
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

          <Route path="lesson-plans">
            <Route index element={<LessonPlansListPage />} />
            <Route path="new" element={<AddLessonPlanPage />} />
            <Route path=":id">
              <Route index element={<SingleLessonPlanPage />} />
              <Route path="edit" element={<EditLessonPlanPage />} />
            </Route>
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

          <Route path="e-library">
            <Route index element={<LibraryBooksPage />} />
            <Route path=":id" element={<SingleLibraryBookPage />} />
          </Route>

          <Route path='library' element={<MyLibraryDetailsPage />} />

          <Route path="schedule" element={<ClassRoutinePage />} />
          <Route path="live-classes" element={<StreamClientProvider />}>
            <Route index element={<OnlineClassesPage />} />
          </Route>

          <Route path="my-attendance" element={<MyAttendancePage />} />
          <Route path="leave-requests">
            <Route index element={<MyLeaveRequestsPage />} />
            <Route path="new" element={<AddLeaveRequestPage />} />
          </Route>
          <Route path="salary" element={<MySalaryPage />} />
          {CommonRoutes()}
        </Route>
      </Route>
      {OnlineClassesRoutes()} {/* This needs to be out of regular layout */}
    </Routes>
  );
};

export default TeacherRoutes;
