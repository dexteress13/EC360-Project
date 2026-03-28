import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ReviewerProfile from "./pages/ReviewerProfile";
import SubmitPaper from "./pages/SubmitPaper";
import Assignment from "./pages/Assignment";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reviewer-profile" element={<ReviewerProfile />} />
        <Route path="/submit-paper" element={<SubmitPaper />} />
        <Route path="/assignment" element={<Assignment />} />
      </Routes>
    </BrowserRouter>
  );
}