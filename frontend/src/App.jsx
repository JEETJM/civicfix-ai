import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DepartmentDashboard from "./pages/DepartmentDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import MapView from "./pages/MapView";
import ReportIssue from "./pages/ReportIssue";
import MyComplaints from "./pages/MyComplaints";
import ComplaintDetails from "./pages/ComplaintDetails";
import TrackComplaint from "./pages/TrackComplaint";
import NotFound from "./pages/NotFound";
import Analytics from "./pages/Analytics";
import { USER_ROLES } from "./utils/rolePermissions";

function App() {
  return (
    <div className="app-shell">
      <Toaster position="top-right" />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/super-admin-login" element={<SuperAdminLogin />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={[USER_ROLES.CITIZEN]}>
                <UserDashboard />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <RoleBasedRoute
                allowedRoles={[
                  USER_ROLES.ADMIN,
                  USER_ROLES.SUPER_ADMIN,
                  USER_ROLES.DEPARTMENT_OFFICER,
                ]}
              >
                <Analytics />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                <AdminDashboard />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/department-dashboard"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={[USER_ROLES.DEPARTMENT_OFFICER]}>
                <DepartmentDashboard />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/super-admin-dashboard"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN]}>
                <SuperAdminDashboard />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/report-issue"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={[USER_ROLES.CITIZEN]}>
                <ReportIssue />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-complaints"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={[USER_ROLES.CITIZEN]}>
                <MyComplaints />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaints/:id"
          element={
            <ProtectedRoute>
              <ComplaintDetails />
            </ProtectedRoute>
          }
        />

        <Route path="/track-complaint" element={<TrackComplaint />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
