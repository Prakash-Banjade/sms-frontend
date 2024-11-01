import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminDashboard } from './pages/dashboard';
import { adminSidebarMenuItems } from './layout/sidebar-items';
import RequireAuth from '@/components/auth/require-auth';
import { ETask, Role } from '@/types/global.type';
import AppRootLayout from '../../components/app-sidebar-layout/root-layout';
import AddAcademicYear from './pages/academic-year/add-academic-year.page';
import AcademicYearsListPage from './pages/academic-year/academic-years-list.page';
import ClassesListPage from './pages/classes/classes-list.page';
import AddClassPage from './pages/classes/add-class-page';
import SubjectsListPage from './pages/subjects/subjects-list.page';
import AddSubjectPage from './pages/subjects/add-subject.page';
import ClassRoutineListPage from './pages/class-routine/class-routine-list.page';
import AddClassRoutinePage from './pages/class-routine/add-class-routine.page';
import DormitoryPage from './pages/dormitory/dormitory.page';
import DormitoryRoomPage from './pages/dormitory/dormitory-room.page';
import RoomTypePage from './pages/dormitory/room-type.page';
import TeacherListPage from './pages/teachers/teacher-list.page';
import AddTeacherPage from './pages/teachers/add-teacher.page';
import EditTeacherPage from './pages/teachers/edit-teacher.page';
import StaffListPage from './pages/staffs/staff-list.page';
import AddStaffPage from './pages/staffs/add-staff.page';
import EditStaffPage from './pages/staffs/edit-staff.page';
import NewRegistrationPage from './pages/students-management/new-registration.page';
import StudentsListPage from './pages/students-management/students-list.page';
import EnrollmentsPage from './pages/students-management/enrollments.page';
import EditStudentPage from './pages/students-management/student-edit.page';
import { SingleStudentPage } from './pages/subjects/single-student.page';
import SectionsListPage from './pages/classes/sections-list.page';
import StudentAttendancePage from './pages/students-management/attendance/student-attendance.page';
import { StudentsLeaveRequestsPage } from './pages/students-management/attendance/leave-request.page';
import { EmployeesLeaveRequestsPage } from './pages/attendances/employee-leave-request.page';
import EmployeeAttendancePage from './pages/attendances/employee-attendance.page';
import LibraryBookListPage from './pages/library/library-book-list.page';
import AddLibraryBookPage from './pages/library/add-library-book.page';
import IssuesAndReturnsPage from './pages/library/issuesAndReturns.page';
import LibraryMembersPage from './pages/library/library-members.page';
import LibraryOverviewPage from './pages/library/library-overview.page';
import BookCategoriesPage from './pages/library/book-categories.page';
import SingleSubjectPage from './pages/subjects/single-subject.page';
import AddNoticePage from './pages/notices/add-notice.page';
import NoticesListPage from './pages/notices/notices-list.page';
import NoticeViewPage from './pages/notices/notice-view.page';
import TasksPage from './pages/tasks/task-list.page';
import AddTaskPage from './pages/tasks/add-task.page';
import EditTaskPage from './pages/tasks/edit-task.page';
import SignleTaskView from './components/tasks/single-task-view';

const AdminRoutes = () => {
    return (
        <Routes>
            <Route element={<RequireAuth authorizedRoles={[Role.ADMIN]} />}>
                <Route element={<AppRootLayout menuItems={adminSidebarMenuItems} />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="academic-years">
                        <Route index element={<AcademicYearsListPage />} />
                        <Route path="new" element={<AddAcademicYear />} />
                    </Route>
                    <Route path="classes">
                        <Route index element={<ClassesListPage />} />
                        <Route path="new" element={<AddClassPage />} />
                        <Route path="sections" element={<SectionsListPage />} />
                    </Route>
                    <Route path="subjects">
                        <Route index element={<SubjectsListPage />} />
                        <Route path="new" element={<AddSubjectPage />} />
                        <Route path=":id" element={<SingleSubjectPage />} />
                    </Route>
                    <Route path="class-routines">
                        <Route index element={<ClassRoutineListPage />} />
                        <Route path="new" element={<AddClassRoutinePage />} />
                    </Route>
                    <Route path="notices">
                        <Route index element={<NoticesListPage />} />
                        <Route path="new" element={<AddNoticePage />} />
                        <Route path=":id" element={<NoticeViewPage />} />
                    </Route>
                    <Route path="tasks">
                        <Route index element={<Navigate to="homeworks" />} />
                        <Route path='homeworks'>
                            <Route index element={<TasksPage type={ETask.HOMEWORK} />} />
                            <Route path='new' element={<AddTaskPage type={ETask.HOMEWORK} />} />
                            <Route path=":id/edit" element={<EditTaskPage type={ETask.HOMEWORK} />} />
                            <Route path=":id" element={<SignleTaskView />} />
                        </Route>
                        <Route path='assignments'>
                            <Route index element={<TasksPage type={ETask.ASSIGNMENT} />} />
                            <Route path='new' element={<AddTaskPage type={ETask.ASSIGNMENT} />} />
                            <Route path=":id/edit" element={<EditTaskPage type={ETask.ASSIGNMENT} />} />
                        </Route>
                    </Route>
                    <Route path="dormitory">
                        <Route index element={<DormitoryPage />} />
                        <Route path="room-types" element={<RoomTypePage />} />
                        <Route path="dormitory-rooms" element={<DormitoryRoomPage />} />
                    </Route>
                    <Route path="teachers">
                        <Route index element={<TeacherListPage />} />
                        <Route path="new" element={<AddTeacherPage />} />
                        <Route path=":id">
                            <Route index element={<div>Teacher single view page</div>} />
                            <Route path="edit" element={<EditTeacherPage />} />
                        </Route>
                    </Route>
                    <Route path="staffs">
                        <Route index element={<StaffListPage />} />
                        <Route path="new" element={<AddStaffPage />} />
                        <Route path=":id">
                            <Route index element={<div>Staff single view page</div>} />
                            <Route path="edit" element={<EditStaffPage />} />
                        </Route>
                    </Route>
                    <Route path="employees">
                        <Route index element={<EmployeeAttendancePage />} />
                        <Route path="leave-requests" element={<EmployeesLeaveRequestsPage />} />
                        <Route path="attendance" element={<EmployeeAttendancePage />} />
                    </Route>
                    <Route path="students">
                        <Route path='new-registration' element={<NewRegistrationPage />} />
                        <Route path="enrollments" element={<EnrollmentsPage />} />
                        <Route index element={<StudentsListPage />} />
                        <Route path='attendance'>
                            <Route index element={<StudentAttendancePage />} />
                            <Route path='leave-requests' element={<StudentsLeaveRequestsPage />} />
                        </Route>
                        <Route path=":id">
                            <Route index element={<SingleStudentPage />} />
                            <Route path="edit" element={<EditStudentPage />} />
                        </Route>
                    </Route>
                    <Route path="library">
                        <Route index element={<LibraryOverviewPage />} />
                        <Route path="books">
                            <Route index element={<LibraryBookListPage />} />
                            <Route path="categories" element={<BookCategoriesPage />} />
                            <Route path="new" element={<AddLibraryBookPage />} />
                        </Route>
                        <Route path="issues-and-returns" element={<IssuesAndReturnsPage />} />
                        <Route path="members" element={<LibraryMembersPage />} />
                    </Route>
                    {/* Add more admin-specific routes */}
                </Route>
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
