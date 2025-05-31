import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const ProfileDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [activeSection, setActiveSection] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("accounts/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const toggleSection = (section) => {
    setActiveSection((prev) => (prev === section ? "" : section));
  };

  if (!profile) {
    return <div className="text-white text-center mt-10">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-[#E0E0E0] p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Profile Dashboard</h1>

      <div className="space-y-4 max-w-3xl mx-auto">
        {/* Section 1: Profile Info */}
        <div className="bg-[#1F4068] rounded-lg shadow-md">
          <button onClick={() => toggleSection("info")} className="w-full p-4 text-left font-semibold">
            1. View Profile Info
          </button>
          {activeSection === "info" && (
            <div className="p-4 border-t border-[#E0E0E0]">
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Age:</strong> {profile.age}</p>
              <p><strong>Education:</strong> {profile.education}</p>
              <p><strong>Profession:</strong> {profile.profession}</p>
              <p><strong>Role:</strong> {profile.user_type}</p>
              <p><strong>Verified:</strong> {profile.is_verified ? "Yes" : "No"}</p>
            </div>
          )}
        </div>

        {/* Section 2: Change Password */}
        <div className="bg-[#1F4068] rounded-lg shadow-md">
          <button onClick={() => toggleSection("changePassword")} className="w-full p-4 text-left font-semibold">
            2. Change Password
          </button>
          {activeSection === "changePassword" && (
            <div className="p-4 border-t border-[#E0E0E0]">
              {/* Replace with your actual change password form */}
              <p className="text-sm">Change password form will go here.</p>
            </div>
          )}
        </div>

        {/* Section 3: Past Contests (Only for Participants) */}
        {profile.user_type === "student" && (
          <div className="bg-[#1F4068] rounded-lg shadow-md">
            <button onClick={() => toggleSection("pastContests")} className="w-full p-4 text-left font-semibold">
              3. View Past Contests/Submissions
            </button>
            {activeSection === "pastContests" && (
              <div className="p-4 border-t border-[#E0E0E0]">
                {/* Replace with actual logic to show past contests */}
                <p className="text-sm">Past contests/submissions will be listed here.</p>
              </div>
            )}
          </div>
        )}

        {/* Section 4 & 5: Create/Manage Contests (Only for Admins) */}
        {profile.user_type !== "student" && (
          <>
            <div className="bg-[#1F4068] rounded-lg shadow-md">
              <button onClick={() => toggleSection("createContest")} className="w-full p-4 text-left font-semibold">
                4. Create Contest
              </button>
              {activeSection === "createContest" && (
                <div className="p-4 border-t border-[#E0E0E0]">
                  <p className="text-sm">Create contest form goes here.</p>
                </div>
              )}
            </div>

            <div className="bg-[#1F4068] rounded-lg shadow-md">
              <button onClick={() => toggleSection("manageContests")} className="w-full p-4 text-left font-semibold">
                5. Manage Created Contests
              </button>
              {activeSection === "manageContests" && (
                <div className="p-4 border-t border-[#E0E0E0]">
                  <p className="text-sm">List of contests created by the user will appear here.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileDashboard;
