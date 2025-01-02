import { lazy } from "react";
import AppRootLayout from "@/components/app-sidebar-layout/root-layout";
import RequireAuth from "@/components/auth/require-auth";
import { ETask, Role } from "@/types/global.type";
import { Navigate, Route, Routes } from "react-router-dom";
import { studentSidebarMenuItems } from "./layout/sidebar-items";
import AccountPage from "../admin/pages/account/account.page";
const StudentTaskPage = lazy(() => import("./pages/academics/assigment.page"));
const StudentAttendenceListPage = lazy(() => import("./pages/academics/attendence.page"));
const ClassRoutineListPage = lazy(() => import("../admin/pages/class-routine/class-routine-list.page"));
const NoticeViewPage = lazy(() => import("../admin/pages/notices/notice-view.page"));
const NoticePage = lazy(() => import("./pages/notice.page"));
const SingleStudentTask = lazy(() => import("./components/task/assignments/single-assignment"));
const StudentTeacherListPage = lazy(() => import("./pages/student-teacher-list.page"));
const StudentVechicleDetailsPage = lazy(() => import("./pages/student-vechicle-details.page"));
const StudentLibraryDetailsPage = lazy(() => import("./pages/student-library-details.page"));
const LeaveRequestPage = lazy(() => import("./pages/academics/leave-request.page"));
const LeaveRequestConfirmation = lazy(() => import("./components/leave-request/leave-request-confirmation"));
const StudentDormitoryPage = lazy(() => import("./pages/academics/stu-dormitory.page"));
const StudentExamRoutinePage = lazy(() => import("./pages/academics/st-exam-routine.page"));
const StudentExamReportPage = lazy(() => import("./pages/academics/stu-exam-report.page"));
const StudentDashboardPage = lazy(() => import("./pages/student-dashboard.page"));

const StudentRoutes = () => {
  return (
    <Routes>
      <Route element={<RequireAuth authorizedRoles={[Role.STUDENT]} />}>
        <Route element={<AppRootLayout menuItems={studentSidebarMenuItems} />}>
          <Route path="dashboard" element={<StudentDashboardPage />} />
          <Route path="tasks">
            <Route index element={<Navigate to="homeworks" />} />
            <Route path="homeworks">
              <Route index element={<StudentTaskPage type={ETask.HOMEWORK} />} />
              <Route path=":id">
                <Route index element={<SingleStudentTask />} />
              </Route>
            </Route>
            <Route path="assignments">
              <Route index element={<StudentTaskPage type={ETask.ASSIGNMENT} />} />
              <Route path=":id">
                <Route index element={<SingleStudentTask />} />
              </Route>
            </Route>
          </Route>
          <Route path="attendance" element={<StudentAttendenceListPage />} />
          <Route path="class-routine" element={<ClassRoutineListPage />} />
          <Route path="teachers" element={<StudentTeacherListPage />} />
          <Route path='trasports' element={<StudentVechicleDetailsPage />} />
          <Route path='library' element={<StudentLibraryDetailsPage />} />
          <Route path='dormitory' element={<StudentDormitoryPage />} />
          <Route path='exam-routine' element={<StudentExamRoutinePage />} />
          <Route path='exam-report' element={<StudentExamReportPage />} />
          <Route path="leave-request">
            <Route index element={<LeaveRequestPage />} />
            <Route path="confirm" element={<LeaveRequestConfirmation />} />
          </Route>
          <Route path="notices">
            <Route index element={<NoticePage />} />
            <Route path=":id" element={<NoticeViewPage />} />
          </Route>
          <Route path="account" element={<AccountPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default StudentRoutes;
