import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import HrManagement from "./pages/Admin/HrManagement";
import DepartmentManagement from "./pages/Admin/DepartmentManagement";

import EmployeeManagement from "./pages/Hr/EmployeeManagement";
import Attendance from "./pages/Hr/Attendance";
import LeaveManagement from "./pages/Hr/LeaveManagement";
import PayrollManagement from "./pages/Hr/PayrollManagement";
import ResumeAnalyzer from "./pages/Hr/ResumeAnalyzer";
import CoverLetterGenerator from "./pages/Hr/CoverLetterGenerator";

import EmployeeAttendance from "./pages/Employee/EmployeeAttendance";
import EmployeeLeaves from "./pages/Employee/EmployeeLeaves";
import EmployeePayroll from "./pages/Employee/EmployeePayroll";

import ProtectedRoute from "./auth/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* DEFAULT */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* PUBLIC */}
      <Route path="/login" element={<Login />} />

      {/* DASHBOARD (ROLE BASED) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* ==========================
            ADMIN MODULE
      =========================== */}
      <Route
        path="/admin/hrs"
        element={
          <ProtectedRoute>
            <HrManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/departments"
        element={
          <ProtectedRoute>
            <DepartmentManagement />
          </ProtectedRoute>
        }
      />

      {/* ==========================
            HR MODULE
      =========================== */}
      <Route
        path="/hr/employees"
        element={
          <ProtectedRoute>
            <EmployeeManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hr/attendance"
        element={
          <ProtectedRoute>
            <Attendance />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hr/leaves"
        element={
          <ProtectedRoute>
            <LeaveManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hr/payroll"
        element={
          <ProtectedRoute>
            <PayrollManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hr/resume-analyzer"
        element={
          <ProtectedRoute>
            <ResumeAnalyzer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hr/cover-letter"
        element={
          <ProtectedRoute>
            <CoverLetterGenerator />
          </ProtectedRoute>
        }
      />

      {/* ==========================
          EMPLOYEE MODULE
      =========================== */}
      <Route
        path="/employee/attendance"
        element={
          <ProtectedRoute>
            <EmployeeAttendance />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee/leaves"
        element={
          <ProtectedRoute>
            <EmployeeLeaves />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee/payroll"
        element={
          <ProtectedRoute>
            <EmployeePayroll />
          </ProtectedRoute>
        }
      />

      {/* FALLBACK */}
      <Route
        path="*"
        element={<h3 className="text-center mt-5">404 - Page Not Found</h3>}
      />
    </Routes>
  );
}

export default App;
