import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SubmitPaper from "./pages/SubmitPaper";
import Assignment from "./pages/Assignment";
import AssignedPapers from "./pages/AssignedPapers";
import UpdateProfile from "./pages/UpdateProfile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/submit-paper" element={<SubmitPaper />} />
        <Route path="/assignment" element={<Assignment />} />
        <Route path="/assigned-papers" element={<AssignedPapers />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
      </Routes>
    </BrowserRouter>
  );
}