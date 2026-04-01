import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ReviewerDashboard from "./pages/ReviewerDashboard";
import SubmitPaper from "./pages/SubmitPaper";
import Assignment from "./pages/Assignment";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* ✅ IMPORTANT FIX */}
        <Route path="/dashboard" element={<Dashboard />} />

<Route path="/reviewer-dashboard" element={<ReviewerDashboard />} />
        <Route path="/submit-paper" element={<SubmitPaper />} />
        <Route path="/assignment" element={<Assignment />} />
      </Routes>
    </BrowserRouter>
  );
}