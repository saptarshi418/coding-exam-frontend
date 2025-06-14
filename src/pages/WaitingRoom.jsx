import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { toast } from "react-toastify";

const WaitingRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [totalTime, setTotalTime] = useState(null);
  const videoRef = useRef(null);
  const soundRef = useRef(null);

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await axios.get(`contests/${id}/`);
        const startTime = new Date(response.data.start_time);
        const now = new Date();
        const diff = startTime - now;

        setContest({ ...response.data, startTime });
        setTimeLeft(diff);
        setTotalTime(diff);

        const interval = setInterval(() => {
          const now = new Date();
          const diff = startTime - now;

          if (diff <= 0) {
            clearInterval(interval);
            soundRef.current.play();
            toast.success("Contest started!");
            navigate(`/code-room/${id}`);
          } else {
            setTimeLeft(diff);
          }
        }, 1000);

        return () => clearInterval(interval);
      } catch (err) {
        toast.error("Failed to fetch contest details.");
      }
    };

    fetchContest();
  }, [id, navigate]);

  useEffect(() => {
    const setupWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        toast.error("Could not access webcam.");
      }
    };
    setupWebcam();
  }, []);

  const formatTimeLeft = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const progress = totalTime ? (1 - timeLeft / totalTime) * 100 : 0;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  if (!contest) return <div className="p-6 text-center text-gray-300">Loading contest...</div>;

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-[#E0E0E0] p-6 flex flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-bold text-center">Waiting for "{contest.title}" to Start</h1>

      {/* Circular Countdown Timer */}
      <div className="relative w-48 h-48">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="#1F4068"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="#6B8AFF"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-3xl font-mono text-[#6B8AFF]">
          {formatTimeLeft(timeLeft || 0)}
        </div>
      </div>

      {/* Webcam Preview */}
      <div className="w-full max-w-sm">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full rounded-xl border-4 border-[#6B8AFF]"
        ></video>
        <p className="text-center text-sm text-gray-400 mt-2">Webcam is active</p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/contests")}
          className="bg-[#FF6B6B] text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Cancel / Leave
        </button>
      </div>

      {/* Audio for start sound */}
      <audio ref={soundRef} src="/sounds/start-sound.mp3" preload="auto" />
    </div>
  );
};

export default WaitingRoom;
