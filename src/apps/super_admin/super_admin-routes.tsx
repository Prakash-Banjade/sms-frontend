import { lazy } from 'react';
import RequireAuth from '@/components/auth/require-auth';
import { ETask, Role } from '@/types/global.type';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppRootLayout from '@/components/app-sidebar-layout/root-layout';
import { superAdminSidebarMenuItems } from './layout/sidebar-items';
const BranchesListPage = lazy(() => import('./pages/branches/branches-list.page'));
const AdminsListPage = lazy(() => import('./pages/admins/admins-list-page'));
const AddAdminPage = lazy(() => import('./pages/admins/add-admin-page'));
const AcademicYearsListPage = lazy(() => import('./pages/academic-year/academic-years-list.page'));
const AddAcademicYear = lazy(() => import('./pages/academic-year/add-academic-year.page'));
const ExamTypesPage = lazy(() => import('../admin/pages/examination/exam-types.page'));
const MarkGradePage = lazy(() => import('../admin/pages/examination/mark-grades.page'));
const SingleStaffPage = lazy(() => import('../admin/pages/staffs/single-staff-page'));
const SalaryStructuresPage = lazy(() => import('../admin/pages/finance-system/salary-management/salary-structures/salary-structures.page'));
const PayrollAndPaymentsPage = lazy(() => import('../admin/pages/finance-system/salary-management/payroll-and-payments/payroll-and-payments.page'));
const SingleEmployeeSalaryDetailsPage = lazy(() => import('../admin/pages/finance-system/salary-management/payroll-and-payments/single-employee-salary-details.page'));
const AdminDashboard = lazy(() => import('../admin/pages/dashboard'));
const ClassesListPage = lazy(() => import('../admin/pages/classes/classes-list.page'));
const AddClassPage = lazy(() => import('../admin/pages/classes/add-class-page'));
const SubjectsListPage = lazy(() => import('../admin/pages/subjects/subjects-list.page'));
const AddSubjectPage = lazy(() => import('../admin/pages/subjects/add-subject.page'));
const ClassRoutineListPage = lazy(() => import('../admin/pages/class-routine/class-routine-list.page'));
const AddClassRoutinePage = lazy(() => import('../admin/pages/class-routine/add-class-routine.page'));
const DormitoryPage = lazy(() => import('../admin/pages/dormitory/dormitory.page'));
const DormitoryRoomPage = lazy(() => import('../admin/pages/dormitory/dormitory-room.page'));
const RoomTypePage = lazy(() => import('../admin/pages/dormitory/room-type.page'));
const TeacherListPage = lazy(() => import('../admin/pages/teachers/teacher-list.page'));
const AddTeacherPage = lazy(() => import('../admin/pages/teachers/add-teacher.page'));
const EditTeacherPage = lazy(() => import('../admin/pages/teachers/edit-teacher.page'));
const StaffListPage = lazy(() => import('../admin/pages/staffs/staff-list.page'));
const AddStaffPage = lazy(() => import('../admin/pages/staffs/add-staff.page'));
const EditStaffPage = lazy(() => import('../admin/pages/staffs/edit-staff.page'));
const NewRegistrationPage = lazy(() => import('../admin/pages/students-management/new-registration.page'));
const StudentsListPage = lazy(() => import('../admin/pages/students-management/students-list.page'));
const EnrollmentsPage = lazy(() => import('../admin/pages/students-management/enrollments.page'));
const EditStudentPage = lazy(() => import('../admin/pages/students-management/student-edit.page'));
const SingleStudentPage = lazy(() => import('../admin/pages/subjects/single-student.page'));
const SectionsListPage = lazy(() => import('../admin/pages/classes/sections-list.page'));
const StudentAttendancePage = lazy(() => import('../admin/pages/students-management/attendance/student-attendance.page'));
const StudentsLeaveRequestsPage = lazy(() => import('../admin/pages/students-management/attendance/leave-request.page'));
const EmployeesLeaveRequestsPage = lazy(() => import('../admin/pages/attendances/employee-leave-request.page'));
const EmployeeAttendancePage = lazy(() => import('../admin/pages/attendances/employee-attendance.page'));
const LibraryBookListPage = lazy(() => import('../admin/pages/library/library-book-list.page'));
const AddLibraryBookPage = lazy(() => import('../admin/pages/library/add-library-book.page'));
const IssuesAndReturnsPage = lazy(() => import('../admin/pages/library/issuesAndReturns.page'));
const LibraryMembersPage = lazy(() => import('../admin/pages/library/library-members.page'));
const LibraryOverviewPage = lazy(() => import('../admin/pages/library/library-overview.page'));
const BookCategoriesPage = lazy(() => import('../admin/pages/library/book-categories.page'));
const SingleSubjectPage = lazy(() => import('../admin/pages/subjects/single-subject.page'));
const AddNoticePage = lazy(() => import('../admin/pages/notices/add-notice.page'));
const NoticesListPage = lazy(() => import('../admin/pages/notices/notices-list.page'));
const NoticeViewPage = lazy(() => import('../admin/pages/notices/notice-view.page'));
const TasksPage = lazy(() => import('../admin/pages/tasks/task-list.page'));
const AddTaskPage = lazy(() => import('../admin/pages/tasks/add-task.page'));
const EditTaskPage = lazy(() => import('../admin/pages/tasks/edit-task.page'));
const SingleTaskPage = lazy(() => import('../admin/pages/tasks/single-task.page'));
const SingleClassRoomPage = lazy(() => import('../admin/pages/classes/single-classroom.page'));
const StudentChangeClassPage = lazy(() => import('../admin/pages/students-management/change-class.page'));
const StudentPromotionPage = lazy(() => import('../admin/pages/students-management/student-promotion.page'));
const RouteStopsPage = lazy(() => import('../admin/pages/transportation/route-stops.page'));
const VehiclesPage = lazy(() => import('../admin/pages/transportation/vehicles.page'));
const ExamsPage = lazy(() => import('../admin/pages/examination/exams.page'));
const NewExamPage = lazy(() => import('../admin/pages/examination/new-exam.page'));
const EditExamPage = lazy(() => import('../admin/pages/examination/edit-exam.page'));
const ExamEvaluationPage = lazy(() => import('../admin/pages/examination/exam-evaluation.page'));
const ExamRoutinePage = lazy(() => import('../admin/pages/examination/exam-routine.page'));
const ExaminationReport_SubjectWise = lazy(() => import('../admin/pages/reports/examination-report/subject-wise-report.page'));
const ExaminationReport_StudentWise = lazy(() => import('../admin/pages/reports/examination-report/student-wise-report.page'));
const SingleTeacherPage = lazy(() => import('../admin/pages/teachers/single-teacher.page'));
const SubjectSelectionPage = lazy(() => import('../admin/pages/students-management/subject-selection.page'));
const LessonPlansListPage = lazy(() => import('../admin/pages/lesson-plan/lesson-plans-list.page'));
const AddLessonPlanPage = lazy(() => import('../admin/pages/lesson-plan/add-lesson-plan.page'));
const EditLessonPlanPage = lazy(() => import('../admin/pages/lesson-plan/edit-lesson-plan.page'));
const SingleLessonPlanPage = lazy(() => import('../admin/pages/lesson-plan/single-lesson-plan.page'));
const ChargeHeadsPage = lazy(() => import('../admin/pages/finance-system/fee-management/charge-heads.page'));
const FeeStructuresPage = lazy(() => import('../admin/pages/finance-system/fee-management/fee-structure/fee-structures.page'));
const FeeBillingAndPaymentsPage = lazy(() => import('../admin/pages/finance-system/fee-management/billings-and-payments/fee-billing-and-payment.page'));
const SingleStudentFeeDetailsPage = lazy(() => import('../admin/pages/finance-system/fee-management/billings-and-payments/single-student-fee-details.page'));
const GeneralSettingsPage = lazy(() => import('../admin/pages/settings/general-settings.page'));


const SuperAdminRoutes = () => {
    return (
        <Routes>
            <Route element={<RequireAuth authorizedRoles={[Role.SUPER_ADMIN]} />}>
                <Route element={<AppRootLayout menuItems={superAdminSidebarMenuItems} />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="branches" element={<BranchesListPage />} />
                    <Route path="admins">
                        <Route index element={<AdminsListPage />} />
                        <Route path="new" element={<AddAdminPage />} />
                    </Route>
                    <Route path="academic-years">
                        <Route index element={<AcademicYearsListPage />} />
                        <Route path="new" element={<AddAcademicYear />} />
                    </Route>
                    <Route path="classes">
                        <Route index element={<ClassesListPage />} />
                        <Route path="new" element={<AddClassPage />} />
                        <Route path=":id" element={<SingleClassRoomPage />} />
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
                    <Route path="lesson-plans">
                        <Route index element={<LessonPlansListPage />} />
                        <Route path="new" element={<AddLessonPlanPage />} />
                        <Route path=":id">
                            <Route index element={<SingleLessonPlanPage />} />
                            <Route path="edit" element={<EditLessonPlanPage />} />
                        </Route>
                    </Route>
                    <Route path="examination">
                        <Route index element={<Navigate to="exam-setup" />} />
                        <Route path="exam-type" element={<ExamTypesPage />} />
                        <Route path="marks-grade" element={<MarkGradePage />} />
                        <Route path="exam-setup">
                            <Route index element={<ExamsPage />} />
                            <Route path="new" element={<NewExamPage />} />
                            <Route path=":id">
                                <Route index element={<Navigate to="edit" />} />
                                <Route path="edit" element={<EditExamPage />} />
                                <Route path="evaluation" element={<ExamEvaluationPage />} />
                            </Route>
                        </Route>
                        <Route path="exam-routines" element={<ExamRoutinePage />} />
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
                            <Route path=":id">
                                <Route index element={<SingleTaskPage />} />
                                <Route path="edit" element={<EditTaskPage type={ETask.HOMEWORK} />} />
                            </Route>
                        </Route>
                        <Route path='assignments'>
                            <Route index element={<TasksPage type={ETask.ASSIGNMENT} />} />
                            <Route path='new' element={<AddTaskPage type={ETask.ASSIGNMENT} />} />
                            <Route path=":id">
                                <Route index element={<SingleTaskPage />} />
                                <Route path="edit" element={<EditTaskPage type={ETask.ASSIGNMENT} />} />
                            </Route>
                        </Route>
                    </Route>
                    <Route path="transportation">
                        <Route path="vehicles">
                            <Route index element={<VehiclesPage />} />
                        </Route>
                        <Route path="route-stops" element={<RouteStopsPage />} />
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
                            <Route index element={<SingleTeacherPage />} />
                            <Route path="edit" element={<EditTeacherPage />} />
                        </Route>
                    </Route>
                    <Route path="staffs">
                        <Route index element={<StaffListPage />} />
                        <Route path="new" element={<AddStaffPage />} />
                        <Route path=":id">
                            <Route index element={<SingleStaffPage />} />
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
                        <Route path="subject-selection" element={<SubjectSelectionPage />} />
                        <Route path="change-class" element={<StudentChangeClassPage />} />
                        <Route path="promote" element={<StudentPromotionPage />} />
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
                    <Route path='finance'>
                        <Route path="fee-management">
                            <Route index element={<Navigate to="charge-heads" />} />
                            <Route path="charge-heads" element={<ChargeHeadsPage />} />
                            <Route path="fee-structures" element={<FeeStructuresPage />} />
                            <Route path="billing-and-payments" >
                                <Route index element={<FeeBillingAndPaymentsPage />} />
                                <Route path="student" element={<SingleStudentFeeDetailsPage />} />
                            </Route>
                        </Route>
                        <Route path="salary-management">
                            <Route index element={<Navigate to="salary-structures" />} />
                            <Route path="salary-structures" element={<SalaryStructuresPage />} />
                            <Route path="payroll-and-payments">
                                <Route index element={<PayrollAndPaymentsPage />} />
                                <Route path="employee" element={<SingleEmployeeSalaryDetailsPage />} />
                            </Route>
                        </Route>
                    </Route>
                    <Route path="reports">
                        <Route path="examination-report">
                            <Route index element={<Navigate to="student-wise" />} />
                            <Route path="student-wise" element={<ExaminationReport_StudentWise />} />
                            <Route path="subject-wise" element={<ExaminationReport_SubjectWise />} />
                        </Route>
                    </Route>
                    <Route path="settings">
                        <Route path="general-settings" element={<GeneralSettingsPage />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
};

export default SuperAdminRoutes;
