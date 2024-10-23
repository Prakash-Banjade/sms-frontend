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
                    {/* Add more admin-specific routes */}
                </Route>
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
