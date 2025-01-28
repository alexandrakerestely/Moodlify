import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./components/Auth/Login";
import StudentDashboard from "./components/Dashboard/StudentDashboard";
import TeacherDashboard from "./components/Dashboard/TeacherDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminDashboard from "./components/Dashboard/AdminDashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/student-dashboard" element={<ProtectedRoute requiredRole={"student"}><StudentDashboard /></ProtectedRoute>} />

          <Route path="/teacher-dashboard" element={<ProtectedRoute requiredRole={"teacher"}><TeacherDashboard /></ProtectedRoute>} />

          <Route path="/admin-dashboard" element={<ProtectedRoute requiredRole={"admin"}><AdminDashboard/></ProtectedRoute>} />

          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
