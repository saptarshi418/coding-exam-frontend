import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ViewAllContests = () => {
  const [contests, setContests] = useState([]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get("contests/");
        const all = [
          ...(response.data.ongoing || []),
          ...(response.data.upcoming || []),
        ];
        setContests(all);
      } catch (error) {
        console.error("Failed to fetch contests", error);
        toast.error("Failed to fetch contests.");
        setContests([]);
      }
    };

    fetchContests();
  }, []);

  const now = new Date();
  const filteredContests = contests.filter((contest) => {
    const start = new Date(contest.start_time + 'Z'); // Ensure it's treated as UTC
    const end = new Date(start.getTime() + contest.duration * 60000);
    if (filter === "ongoing") return now >= start && now <= end;
    if (filter === "upcoming") return now < start;
    return true;
  });

  const handleJoin = async (contestId) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("You must be logged in to join a contest.");
      return;
    }

    try {
      await axios.post(`contests/${contestId}/join/`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Joined contest! Redirecting...");
      navigate(`/waiting-room/${contestId}`);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to join contest.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-[#E0E0E0] p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Contests</h2>

      <div className="flex justify-center gap-4 mb-6">
        {["all", "ongoing", "upcoming"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-xl shadow transition ${
              filter === type
                ? "bg-[#6B8AFF] text-white"
                : "bg-[#1F4068] hover:bg-[#6B8AFF] hover:text-white"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {filteredContests.length === 0 ? (
        <p className="text-center text-gray-400">No contests available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContests.map((contest) => {
            const utcDate = new Date(contest.start_time); // Treat as UTC
            const localStart = utcDate.toLocaleString(); // Display in system's local timezone

            return (
              <div
                key={contest.id}
                className="bg-[#1F4068] p-4 rounded-2xl shadow-lg transform transition duration-300 hover:scale-105 hover:bg-[#283e6b]"
              >
                <h3 className="text-xl font-semibold mb-2">{contest.title}</h3>
                <p className="mb-1 text-sm text-gray-300">
                  {contest.description}
                </p>
                <p className="mb-1 text-sm">
                  <strong>Start:</strong> {localStart}
                </p>
                <p className="mb-1 text-sm">
                  Duration: {contest.duration} mins
                </p>
                <p className="text-sm mb-2">
                  Questions: {contest.questions?.length || 0}
                </p>

                <button
                  className="mt-2 w-full bg-[#6BFF6B] text-black font-semibold py-1 px-4 rounded hover:bg-green-400 transition"
                  onClick={() => handleJoin(contest.id)}
                >
                  Join
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ViewAllContests;
