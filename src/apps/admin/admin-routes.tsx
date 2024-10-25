import { Route, Routes } from 'react-router-dom';
import { AdminDashboard } from './pages/dashboard';
import { adminSidebarMenuItems } from './layout/sidebar-items';
import RequireAuth from '@/components/auth/require-auth';
import { Role } from '@/types/global.type';
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
                    </Route>
                    <Route path="subjects">
                        <Route index element={<SubjectsListPage />} />
                        <Route path="new" element={<AddSubjectPage />} />
                    </Route>
                    <Route path="class-routines">
                        <Route index element={<ClassRoutineListPage />} />
                        <Route path="new" element={<AddClassRoutinePage />} />
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
                    <Route path="students">
                        <Route path='new-registration' element={<NewRegistrationPage />} />
                        <Route index element={<StudentsListPage />} />
                        <Route path=":id">
                            <Route index element={<SingleStudentPage />} />
                            <Route path="edit" element={<EditStudentPage />} />
                        </Route>
                    </Route>
                    <Route path="enrollments" element={<EnrollmentsPage />} />
                    {/* Add more admin-specific routes */}
                </Route>
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
