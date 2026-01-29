import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import NavBar from "./components/NavBar";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
