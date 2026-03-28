import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import EditorSignup from "./pages/EditorSignup";
import Dashboard from "./pages/Dashboard";
import ReviewerProfile from "./pages/ReviewerProfile";
import SubmitPaper from "./pages/SubmitPaper";
import Assignment from "./pages/Assignment";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/editor-signup" element={<EditorSignup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reviewer-profile" element={<ReviewerProfile />} />
        <Route path="/submit-paper" element={<SubmitPaper />} />
        <Route path="/assignment" element={<Assignment />} />
      </Routes>
    </BrowserRouter>
  );
}