import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage";
import ForgotPassword from "./pages/ForgotPassword";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Student Layout & Pages
import DashboardLayout from "./layouts/DashboardLayout";
import StudentDashboard from "./pages/StudentDashboard";
import AssessmentCatalog from "./pages/AssessmentCatalog";
import TestInterface from "./pages/TestInterface";
import MyResults from "./pages/MyResults";
import Calendar from "./pages/Calendar";
import StudentAnalytics from "./pages/StudentAnalytics";

// Instructor Layout & Pages
import InstructorLayout from "./layouts/InstructorLayout";
import InstructorDashboard from "./pages/InstructorDashboard";
import CreateAssessment from "./pages/CreateAssessment";
import InstructorAssessments from "./pages/InstructorAssessments";
import EditAssessment from "./pages/EditAssessment";
import InstructorAnalytics from "./pages/InstructorAnalytics";
import SubmissionsInbox from "./pages/SubmissionsInbox";

// Admin Layout & Pages
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";
import AssessmentReports from "./pages/AssessmentReports";
import ActivityLogs from "./pages/ActivityLogs";
import AdminAnalytics from "./pages/AdminAnalytics";
import Settings from "./pages/Settings";
import AllAssessments from "./pages/AllAssessments";
import Profile from "./pages/Profile";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* ── STUDENT ROUTES ── */}
            <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<StudentDashboard />} />
                <Route path="/assessments" element={<AssessmentCatalog />} />
                <Route path="/student/results" element={<MyResults />} />
                <Route path="/student/calendar" element={<Calendar />} />
                <Route path="/student/analytics" element={<StudentAnalytics />} />
                <Route path="/student/profile" element={<Profile />} />
              </Route>
              {/* Distraction-free test (no sidebar) */}
              <Route path="/assessment/:id" element={<TestInterface />} />
            </Route>

            {/* ── INSTRUCTOR ROUTES ── */}
            <Route element={<ProtectedRoute allowedRoles={['Instructor']} />}>
              <Route element={<InstructorLayout />}>
                <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
                <Route path="/instructor/create" element={<CreateAssessment />} />
                <Route path="/instructor/edit/:id" element={<EditAssessment />} />
                <Route path="/instructor/assessments" element={<InstructorAssessments />} />
                <Route path="/instructor/submissions" element={<SubmissionsInbox />} />
                <Route path="/instructor/analytics" element={<InstructorAnalytics />} />
                <Route path="/instructor/profile" element={<Profile />} />
              </Route>
            </Route>

            {/* ── ADMIN ROUTES ── */}
            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/assessments" element={<AllAssessments />} />
                <Route path="/admin/reports" element={<AssessmentReports />} />
                <Route path="/admin/logs" element={<ActivityLogs />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/admin/settings" element={<Settings />} />
                <Route path="/admin/profile" element={<Profile />} />
              </Route>
            </Route>

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
