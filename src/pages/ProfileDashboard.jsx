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
    return <div className="text-center mt-10 text-black">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-[#1A1A2E]">Profile Dashboard</h1>

      <div className="space-y-4 max-w-3xl mx-auto">
        {/* Section 1: Profile Info */}
        <div className="border-2 border-[#1F4068] rounded-lg shadow-md">
          <div className="bg-[#1F4068] p-4 text-white font-semibold rounded-t-lg">Profile Info</div>
          <div className="p-4">
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Age:</strong> {profile.age}</p>
            <p><strong>Education:</strong> {profile.education}</p>
            <p><strong>Profession:</strong> {profile.profession}</p>
            <p><strong>Role:</strong> {profile.user_type}</p>
            
          </div>
        </div>

        {/* Section 2: Change Password */}
        <div className="border-2 border-[#1F4068] rounded-lg shadow-md">
          <button onClick={() => toggleSection("changePassword")} className="w-full bg-[#1F4068] text-white p-4 text-left font-semibold rounded-t-lg">
            Change Password
          </button>
          {activeSection === "changePassword" && (
            <div className="p-4 border-t border-gray-300">
              <p className="text-sm">Change password form will go here.</p>
            </div>
          )}
        </div>

        {/* Section 3: Past Contests (Only for Participants) */}
        {profile.user_type === "student" && (
          <div className="border-2 border-[#1F4068] rounded-lg shadow-md">
            <button onClick={() => toggleSection("pastContests")} className="w-full bg-[#1F4068] text-white p-4 text-left font-semibold rounded-t-lg">
              Past Contests / Submissions
            </button>
            {activeSection === "pastContests" && (
              <div className="p-4 border-t border-gray-300">
                <p className="text-sm">Past contests/submissions will be listed here.</p>
              </div>
            )}
          </div>
        )}

        {/* Section 4 & 5: Create/Manage Contests (Only for Admins) */}
        {profile.user_type !== "student" && (
          <>
            <div className="bg-[#1F4068] rounded-lg shadow-md">
              <div className="p-4 flex items-center justify-between">
                <span className="font-semibold">Create Contest</span>
                  <button
                    onClick={() => navigate("/create-contest")}
                    className="bg-[#6B8AFF] text-white px-4 py-1 rounded hover:bg-blue-600"
                    >
                    Go
                  </button>
              </div>
            </div>


            <div className="border-2 border-[#1F4068] rounded-lg shadow-md">
              <button onClick={() => toggleSection("manageContests")} className="w-full bg-[#1F4068] text-white p-4 text-left font-semibold rounded-t-lg">
                Manage Created Contests
              </button>
              {activeSection === "manageContests" && (
                <div className="p-4 border-t border-gray-300">
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
