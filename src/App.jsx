import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Contests from './pages/Contests';
import ContestDetails from './pages/ContestDetails';
import CodeRoom from './pages/CodeRoom';
import Dashboard from './pages/Dashboard';
import Footer from "./components/Footer";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyOtp from "./pages/VerifyOtp";
import ForgetPassword from './pages/ForgetPassword';

import ResetPassword from './pages/ResetPassword';
import VerifyResetOtp from "./pages/VerifyResetOtp"; // adjust the path if different

import ProfileDashboard from "./pages/ProfileDashboard";



const App = () => {
  return (
    
      <div className="min-h-screen bg-primaryBg text-primaryText">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />

          <Route path="/contests" element={<Contests />} />
          <Route path="/contest/:id" element={<ContestDetails />} />
          <Route path="/code-room/:id" element={<CodeRoom />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          
          <Route path="/reset-password" element={<ResetPassword />} />


          <Route path="/profile" element={<ProfileDashboard />} />


        </Routes>
        <Footer />
      </div>
    
  );
};

export default App;
