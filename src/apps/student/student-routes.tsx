import AppRootLayout from "@/components/app-sidebar-layout/root-layout";
import RequireAuth from "@/components/auth/require-auth";
import { ETask, Role } from "@/types/global.type";
import { Navigate, Route, Routes } from "react-router-dom";
import { studentSidebarMenuItems } from "./layout/sidebar-items";
import StudentTaskPage from "./pages/academics/assigment.page";
import StudentAttendenceListPage from "./pages/academics/attendence.page";
import ClassRoutineListPage from "../admin/pages/class-routine/class-routine-list.page";
import NoticeViewPage from "../admin/pages/notices/notice-view.page";
import NoticePage from "./pages/notice.page";
import SingleStudentTask from "./components/task/assignments/single-assignment";
import StudentTeacherListPage from "./pages/student-teacher-list.page";
import StudentVechicleDetailsPage from "./pages/student-vechicle-details.page";
import StudentLibraryDetailsPage from "./pages/student-library-details.page";

const StudentRoutes = () => {
  return (
    <Routes>
      <Route element={<RequireAuth authorizedRoles={[Role.STUDENT]} />}>
        <Route element={<AppRootLayout menuItems={studentSidebarMenuItems} />}>
          <Route path="dashboard" element={<div>Dashboard xa</div>} />
          <Route path="tasks">
            <Route index element={<Navigate to="homeworks" />} />
            <Route path="homeworks">
              <Route
                index
                element={<StudentTaskPage type={ETask.HOMEWORK} />}
              />
              <Route path=":id">
                <Route index element={<SingleStudentTask />} />
              </Route>
            </Route>
            <Route path="assignments">
              <Route
                index
                element={<StudentTaskPage type={ETask.ASSIGNMENT} />}
              />

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
          <Route path="notices">
            <Route index element={<NoticePage />} />
            <Route path=":id" element={<NoticeViewPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default StudentRoutes;
