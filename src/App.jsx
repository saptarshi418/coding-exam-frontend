import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



import Navbar from './components/Navbar';
import Home from './pages/Home';
// import Contests from './pages/Contests';
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
import CreateContest from "./pages/CreateContest";
import ViewAllContests from "./pages/ViewAllContests";
import WaitingRoom from "./pages/WaitingRoom";



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

          
          <Route path="/contest/:id" element={<ContestDetails />} />
          <Route path="/code-room/:id" element={<CodeRoom />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          
          <Route path="/reset-password" element={<ResetPassword />} />


          <Route path="/profile" element={<ProfileDashboard />} />
          <Route path="/create-contest" element={<CreateContest />} />
          <Route path="/contests" element={<ViewAllContests />} />
          <Route path="/waiting-room/:id" element={<WaitingRoom />} />



          
        </Routes>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    
  );
};

export default App;
