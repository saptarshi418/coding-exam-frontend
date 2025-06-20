import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { toast } from "react-toastify";
import Editor from "@monaco-editor/react";

const CodeRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contest, setContest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  const videoRef = useRef(null);

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await axios.get(`contests/contests/${id}/`);
        setContest(response.data);

        // Start countdown
        const startTime = new Date(response.data.start_time);
        const endTime = new Date(startTime.getTime() + response.data.duration * 60000);
        const now = new Date();
        const remaining = endTime - now;
        setTimeLeft(remaining);

        const interval = setInterval(() => {
          const now = new Date();
          const diff = endTime - now;
          if (diff <= 0) {
            clearInterval(interval);
            toast.info("Time's up! Submitting your code...");
            handleEndContest();
          } else {
            setTimeLeft(diff);
          }
        }, 1000);

        return () => clearInterval(interval);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch contest details");
      }
    };

    fetchContest();
  }, [id]);

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
    if (ms <= 0) return "00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleRunCode = async () => {
    if (!contest) return;
    setLoading(true);
    try {
      const response = await axios.post(`${id}/test/`, {
        code,
        language,
        input,
        question_id: contest.questions[currentQuestionIndex].id,
      });
      setOutput(response.data.output);
    } catch (error) {
      console.error(error);
      toast.error("Failed to run code");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!contest) return;
    setLoading(true);
    try {
      const response = await axios.post(`${id}/submit/`, {
        code,
        language,
        question_id: contest.questions[currentQuestionIndex].id,
      });
      toast.success(response.data.message || "Submitted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit code");
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setCode("");
      setOutput("");
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < contest.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCode("");
      setOutput("");
    }
  };

  const handleEndContest = () => {
    toast.info("Contest ended.");
    navigate("/contests");
  };

  if (!contest) {
    return <div className="p-6 text-center text-gray-300">Loading contest...</div>;
  }

  const question = contest.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-[#E0E0E0] p-4 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-bold">{contest.title}</div>
        <div className="text-md font-mono bg-[#1F4068] px-4 py-1 rounded">
          Timer: {formatTimeLeft(timeLeft)}
        </div>
        <button
          onClick={handleRunCode}
          className="bg-[#6B8AFF] px-4 py-2 rounded text-black font-bold"
        >
          {loading ? "Running..." : "Run"}
        </button>
      </div>

      <div className="flex flex-1 gap-4">
        {/* Left Panel */}
        <div className="w-1/4 space-y-4 bg-[#1F4068] p-4 rounded">
          <div>
            <h2 className="font-bold mb-2">Question</h2>
            <p>{question.title}</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Description</h3>
            <p>{question.description}</p>
          </div>
          <div>
            <button
              onClick={handleRunCode}
              className="bg-[#6B8AFF] px-3 py-1 rounded mb-2 text-black"
            >
              Test Code
            </button>
            <h3 className="font-bold">Test Case</h3>
            {question.test_cases.map((tc, i) => (
              <div key={i} className="bg-[#283E6B] p-2 rounded my-1">
                <strong>Input:</strong> {tc.input}
                <br />
                <strong>Expected:</strong> {tc.expected_output}
              </div>
            ))}
          </div>
        </div>

        {/* Center Panel */}
        <div className="w-2/4 flex flex-col space-y-4">
          <Editor
            height="400px"
            language={language === "cpp" ? "cpp" : language}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value)}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
            }}
          />
          <textarea
            value={output}
            readOnly
            placeholder="Output will appear here..."
            className="w-full h-56 p-2 rounded bg-black text-green-400"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className="bg-[#6B8AFF] px-3 py-1 rounded"
            >
              Prev
            </button>
            <span className="px-2">{currentQuestionIndex + 1}</span>
            <button
              onClick={handleNext}
              disabled={currentQuestionIndex === contest.questions.length - 1}
              className="bg-[#6B8AFF] px-3 py-1 rounded"
            >
              Next
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/4 space-y-4">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full rounded border-4 border-[#6B8AFF]"
          ></video>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-2 rounded bg-[#1F4068]"
          >
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="c">C</option>
          </select>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Custom input (optional)"
            className="w-full h-24 p-2 rounded bg-[#1F4068] text-white"
          />
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-4 mt-4">
        <button
          onClick={handleEndContest}
          className="bg-[#FF6B6B] px-4 py-2 rounded text-white"
        >
          End Contest
        </button>
        <button
          onClick={handleSubmitCode}
          className="bg-green-500 px-4 py-2 rounded text-black font-bold"
        >
          Submit Code
        </button>
      </div>
    </div>
  );
};

export default CodeRoom;
