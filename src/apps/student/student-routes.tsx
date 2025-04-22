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
import SingleSubjectPage from "../admin/pages/subjects/single-subject.page";
import TasksPage from "./pages/tasks/tasks.page";
import MySubjectsPage from "./pages/my-subjects.page";
import TaskSubmitPage from "./pages/tasks/task-submit.page";
import ClassRoutinePage from "./pages/class-routine.page";
import StudentExamRoutinePage from "./pages/examination/student-exam-routine.page";
import StudentExamReportPage from "./pages/examination/student-exam-report.page";
const NoticeViewPage = lazy(() => import("../admin/pages/notices/notice-view.page"));
const NoticePage = lazy(() => import("./pages/notice.page"));
const StudentTeacherListPage = lazy(() => import("./pages/student-teacher-list.page"));
const StudentVechicleDetailsPage = lazy(() => import("./pages/student-vechicle-details.page"));
const StudentLibraryDetailsPage = lazy(() => import("./pages/student-library-details.page"));
const StudentDormitoryPage = lazy(() => import("./pages/academics/stu-dormitory.page"));
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
          <Route path="class-routine" element={<ClassRoutinePage />} />
          <Route path="teachers" element={<StudentTeacherListPage />} />
          <Route path='trasports' element={<StudentVechicleDetailsPage />} />
          <Route path='library' element={<StudentLibraryDetailsPage />} />
          <Route path='dormitory' element={<StudentDormitoryPage />} />
          <Route path="examination">
            <Route path='routine' element={<StudentExamRoutinePage />} />
            <Route path='report' element={<StudentExamReportPage />} />
          </Route>
          <Route path="live-classes" element={<StreamClientProvider />}>
            <Route index element={<OnlineClassesPage />} />
          </Route>
          <Route path="leave-requests">
            <Route index element={<MyLeaveRequestsPage />} />
            <Route path="new" element={<AddLeaveRequestPage />} />
          </Route>
          <Route path="notices">
            <Route index element={<NoticePage />} />
            <Route path=":id" element={<NoticeViewPage />} />
          </Route>
          {CommonRoutes()}
        </Route>
      </Route>
      {OnlineClassesRoutes()} {/* This needs to be out of regular layout */}
    </Routes>
  );
};

export default StudentRoutes;
