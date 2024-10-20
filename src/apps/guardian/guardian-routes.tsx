import { Route, Routes } from 'react-router-dom';
// import GuardianLayout from './layout/GuardianLayout';
// import GuardianDashboard from './pages/GuardianDashboard';
// Add more guardian pages as needed

const GuardianRoutes = () => {
  return (
    <Routes>
      <Route element={<div />}>
        <Route path="dashboard" element={<div />} />
        {/* Add more guardian-specific routes */}
      </Route>
    </Routes>
  );
};

export default GuardianRoutes;
