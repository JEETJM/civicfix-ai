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
import AdminComplaints from "./pages/AdminComplaints";
import AdminComplaintDetails from "./pages/AdminComplaintDetails";
import ManageUsers from "./pages/ManageUsers";
import ManageDepartments from "./pages/ManageDepartments";
import ProfileSettings from "./pages/ProfileSettings";
import DepartmentComplaints from "./pages/DepartmentComplaints";
import DepartmentComplaintDetails from "./pages/DepartmentComplaintDetails";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
// import TrackComplaint from "./pages/TrackComplaint";
import EscalationCenter from "./pages/EscalationCenter";
import Feedback from "./pages/Feedback";
import { USER_ROLES } from "./utils/rolePermissions";

function App() {
  return (
    <div className="app-shell">
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 2600,
          style: {
            borderRadius: "16px",
            padding: "14px 16px",
            fontWeight: "800",
            boxShadow: "0 18px 45px rgba(15, 23, 42, 0.18)",
            zIndex: 999999,
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
            style: {
              background: "#fff1f2",
              color: "#991b1b",
            },
          },
        }}
      />{" "}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/super-admin-login" element={<SuperAdminLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />

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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/track-complaint" element={<TrackComplaint />} />

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
          path="/escalations"
          element={
            <ProtectedRoute>
              <RoleBasedRoute
                allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]}
              >
                <EscalationCenter />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <RoleBasedRoute
                allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]}
              >
                <Feedback />
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
          path="/admin/complaints"
          element={
            <ProtectedRoute>
              <RoleBasedRoute
                allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]}
              >
                <AdminComplaints />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/complaints/:id"
          element={
            <ProtectedRoute>
              <RoleBasedRoute
                allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]}
              >
                <AdminComplaintDetails />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/super-admin/users"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN]}>
                <ManageUsers />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/super-admin/departments"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN]}>
                <ManageDepartments />
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
          path="/department/complaints"
          element={
            <ProtectedRoute>
              <RoleBasedRoute
                allowedRoles={[
                  USER_ROLES.DEPARTMENT_OFFICER,
                  USER_ROLES.ADMIN,
                  USER_ROLES.SUPER_ADMIN,
                ]}
              >
                <DepartmentComplaints />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/department/complaints/:id"
          element={
            <ProtectedRoute>
              <RoleBasedRoute
                allowedRoles={[
                  USER_ROLES.DEPARTMENT_OFFICER,
                  USER_ROLES.ADMIN,
                  USER_ROLES.SUPER_ADMIN,
                ]}
              >
                <DepartmentComplaintDetails />
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
          path="/profile-settings"
          element={
            <ProtectedRoute>
              <ProfileSettings />
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
