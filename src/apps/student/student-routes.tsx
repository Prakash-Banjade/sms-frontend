import { Route, Routes } from 'react-router-dom';
// import StudentLayout from './layout/StudentLayout';
// import StudentDashboard from './pages/StudentDashboard';
// Add more student pages as needed

const StudentRoutes = () => {
  return (
    <Routes>
      <Route element={<div />}>
        <Route path="dashboard" element={<div />} />
        {/* Add more student-specific routes */}
      </Route>
    </Routes>
  );
};

export default StudentRoutes;
