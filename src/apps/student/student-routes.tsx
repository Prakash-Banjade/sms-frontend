import { lazy } from "react";
import AppRootLayout from "@/components/app-sidebar-layout/root-layout";
import RequireAuth from "@/components/auth/require-auth";
import { ETask, Role } from "@/types/global.type";
import { Navigate, Route, Routes } from "react-router-dom";
import { studentSidebarMenuItems } from "./layout/sidebar-items";
import { CommonRoutes, OnlineClassesRoutes } from "../common/common-routes";
const MyLeaveRequestsPage = lazy(() => import("../common/pages/leave-request/my-leave-requests.page"));
const AddLeaveRequestPage = lazy(() => import("../common/pages/leave-request/add-leave-request.page"));
import StreamClientProvider from "../teacher/layout/stream-client-provider";
import { LibraryBooksPage } from "../common/pages/library-books/library-books.page";
import SingleLibraryBookPage from "../admin/pages/library/single-library-book.page";
const SingleSubjectPage = lazy(() => import("../admin/pages/subjects/single-subject.page"));
const TasksPage = lazy(() => import("./pages/tasks/tasks.page"));
const MySubjectsPage = lazy(() => import("./pages/my-subjects.page"));
const TaskSubmitPage = lazy(() => import("./pages/tasks/task-submit.page"));
const ClassRoutinePage = lazy(() => import("./pages/class-routine.page"));
const StudentExamRoutinePage = lazy(() => import("./pages/examination/student-exam-routine.page"));
const StudentExamReportPage = lazy(() => import("./pages/examination/student-exam-report.page"));
const MyAttendancePage = lazy(() => import("./pages/my-attendance.page"));
const MyDormitoryPage = lazy(() => import("./pages/my-dormitory.page"));
const MyFeesPage = lazy(() => import("./pages/my-fees.page"));
const LessonPlanPage = lazy(() => import("./pages/lesson-plan.page"));
const SingleLessonPlanPage = lazy(() => import("../teacher/pages/lesson-plan/single-lesson-plan.page"));
const NoticeViewPage = lazy(() => import("../admin/pages/notices/notice-view.page"));
const NoticePage = lazy(() => import("./pages/notice.page"));
const StudentTeacherListPage = lazy(() => import("./pages/student-teacher-list.page"));
const StudentLibraryDetailsPage = lazy(() => import("./pages/student-library-details.page"));
const StudentDashboardPage = lazy(() => import("./pages/student-dashboard.page"));
const OnlineClassesPage = lazy(() => import("../common/pages/online-classes/online-classes.page"));

const StudentRoutes = () => {
  return (
    <Routes>
      <Route element={<RequireAuth authorizedRoles={[Role.STUDENT]} />}>
        <Route element={<AppRootLayout menuItems={studentSidebarMenuItems} />}>
          <Route path="dashboard" element={<StudentDashboardPage />} />
          <Route path="subjects">
            <Route index element={<MySubjectsPage />} />
            <Route path=":id" element={<SingleSubjectPage />} />
          </Route>
          <Route path="tasks">
            <Route index element={<Navigate to="homeworks" />} />
            <Route path='homeworks' element={<TasksPage type={ETask.HOMEWORK} />} />
            <Route path='assignments'>
              <Route index element={<TasksPage type={ETask.ASSIGNMENT} />} />
              <Route path="submit"> {/* Only assignments are submitted, not homeworks */}
                <Route index element={<Navigate to={`/${Role.STUDENT}/tasks/homeworks`} />} />
                <Route path=":id" element={<TaskSubmitPage type={ETask.ASSIGNMENT} />} />
              </Route>
            </Route>
          </Route>
          <Route path="lesson-plans">
            <Route index element={<LessonPlanPage />} />
            <Route path=":id" element={<SingleLessonPlanPage />} />
          </Route>
          <Route path="class-routine" element={<ClassRoutinePage />} />
          <Route path="teachers" element={<StudentTeacherListPage />} />
          <Route path='library' element={<StudentLibraryDetailsPage />} />
          <Route path='dormitory' element={<MyDormitoryPage />} />
          <Route path="examination">
            <Route path='routine' element={<StudentExamRoutinePage />} />
            <Route path='report' element={<StudentExamReportPage />} />
          </Route>
          <Route path="live-classes" element={<StreamClientProvider />}>
            <Route index element={<OnlineClassesPage />} />
          </Route>
          <Route path="e-library">
            <Route index element={<LibraryBooksPage />} />
            <Route path=":id" element={<SingleLibraryBookPage />} />
          </Route>
          <Route path="leave-requests">
            <Route index element={<MyLeaveRequestsPage />} />
            <Route path="new" element={<AddLeaveRequestPage />} />
          </Route>
          <Route path="attendance" element={<MyAttendancePage />} />
          <Route path="notices">
            <Route index element={<NoticePage />} />
            <Route path=":id" element={<NoticeViewPage />} />
          </Route>
          <Route path="fees" element={<MyFeesPage />} />
          {CommonRoutes()}
        </Route>
      </Route>
      {OnlineClassesRoutes()} {/* This needs to be out of regular layout */}
    </Routes>
  );
};

export default StudentRoutes;
