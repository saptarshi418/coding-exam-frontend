import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#1F4068] text-[#E0E0E0] py-6 mt-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Online Coding Contest Platform. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-[#FF6B6B] transition">Privacy Policy</a>
          <a href="#" className="hover:text-[#FF6B6B] transition">Terms of Service</a>
          <a href="#" className="hover:text-[#FF6B6B] transition">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
