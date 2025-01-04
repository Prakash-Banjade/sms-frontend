import { lazy } from 'react';
import RequireAuth from '@/components/auth/require-auth';
import { Role } from '@/types/global.type';
import { Route, Routes } from 'react-router-dom';
import AppRootLayout from '@/components/app-sidebar-layout/root-layout';
import { superAdminSidebarMenuItems } from './layout/sidebar-items';
import { CommonRoutes } from '../common/common-routes';
import { AdminRoutesGroup } from '../admin/admin-routes';
const BranchesListPage = lazy(() => import('./pages/branches/branches-list.page'));
const AdminsListPage = lazy(() => import('./pages/admins/admins-list-page'));
const AddAdminPage = lazy(() => import('./pages/admins/add-admin-page'));
const AcademicYearsListPage = lazy(() => import('./pages/academic-year/academic-years-list.page'));
const AddAcademicYear = lazy(() => import('./pages/academic-year/add-academic-year.page'));

const SuperAdminRoutes = () => {
    return (
        <Routes>
            <Route element={<RequireAuth authorizedRoles={[Role.SUPER_ADMIN]} />}>
                <Route element={<AppRootLayout menuItems={superAdminSidebarMenuItems} />}>
                    <Route path="branches" element={<BranchesListPage />} />
                    <Route path="admins">
                        <Route index element={<AdminsListPage />} />
                        <Route path="new" element={<AddAdminPage />} />
                    </Route>
                    <Route path="academic-years">
                        <Route index element={<AcademicYearsListPage />} />
                        <Route path="new" element={<AddAcademicYear />} />
                    </Route>
                    {AdminRoutesGroup()}
                    {CommonRoutes()}
                </Route>
            </Route>
        </Routes>
    );
};

export default SuperAdminRoutes;
