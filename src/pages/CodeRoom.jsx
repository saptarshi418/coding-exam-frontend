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

  // ✅ Correct mapping for Judge0 CE
  const judge0LangMap = {
    python: 71,
    java: 62,
    cpp: 54,
    c: 50,
  };

  // ✅ Correct Judge0 CE host & key
  const JUDGE0_URL =
    "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true";
  const judge0Headers = {
    "content-type": "application/json",
    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
    "X-RapidAPI-Key": "a99ec05a28msh63a8db0ba6173c6p16dab8jsn4cb08657333f",
  };

  // ✅ Fetch contest once
  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await axios.get(`contests/contests/${id}/`);
        const updated = res.data.questions.map((q) => ({
          ...q,
          submitted: false,
        }));
        setContest({ ...res.data, questions: updated });

        // Timer setup
        const startTime = new Date(res.data.start_time);
        const endTime = new Date(
          startTime.getTime() + res.data.duration * 60000
        );
        const now = new Date();
        const remaining = endTime - now;
        setTimeLeft(remaining);

        const interval = setInterval(() => {
          const now = new Date();
          const diff = endTime - now;
          if (diff <= 0) {
            clearInterval(interval);
            toast.info("Time's up! Submitting...");
            handleEndContest();
          } else {
            setTimeLeft(diff);
          }
        }, 1000);

        return () => clearInterval(interval);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load contest");
      }
    };
    fetchContest();
  }, [id]);

  // ✅ Webcam
  useEffect(() => {
    const setupWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        toast.error("Webcam blocked");
      }
    };
    setupWebcam();
  }, []);

  // ✅ Timer formatter
  const formatTimeLeft = (ms) => {
    if (ms <= 0) return "00:00";
    const s = Math.floor(ms / 1000);
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${m}:${sec}`;
  };

  // ✅ Run code with custom input
  const handleRunCode = async () => {
    if (!contest) return;
    setLoading(true);
    try {
      const langId = judge0LangMap[language];
      if (!langId) throw new Error("Unsupported lang");

      const res = await axios.post(
        JUDGE0_URL,
        { source_code: code, language_id: langId, stdin: input },
        { headers: judge0Headers }
      );
      const result = res.data;
      const out =
        result.stdout || result.stderr || result.compile_output || "No output.";
      setOutput(out.trim());
    } catch (err) {
      console.error(err);
      toast.error("Judge0 error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Submit all test cases, only once
  const handleSubmitCode = async () => {
    if (!contest) return;
    const question = contest.questions[currentQuestionIndex];
    if (question.submitted) {
      toast.info("Already submitted");
      return;
    }

    setLoading(true);
    try {
      const langId = judge0LangMap[language];
      if (!langId) throw new Error("Unsupported lang");

      let allPass = true;

      for (const [i, tc] of question.test_cases.entries()) {
        const res = await axios.post(
          JUDGE0_URL,
          { source_code: code, language_id: langId, stdin: tc.input },
          { headers: judge0Headers }
        );
        const result = res.data;
        const out = (result.stdout || "").trim();
        if (out === tc.expected_output.trim()) {
          toast.success(`✅ Test ${i + 1} Passed`);
        } else {
          toast.error(`❌ Test ${i + 1} Failed`);
          allPass = false;
        }
      }

      if (allPass) {
        await axios.post(`contests/${id}/submit/`, {
          code,
          language,
          question_id: question.id,
        });
        toast.success("✅ All passed! Submitted.");

        const updated = [...contest.questions];
        updated[currentQuestionIndex].submitted = true;
        setContest({ ...contest, questions: updated });
      } else {
        toast.info("Fix errors & retry");
      }
    } catch (err) {
      console.error(err);
      toast.error("Submit failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Nav handlers
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
    return (
      <div className="p-6 text-center text-gray-300">Loading contest...</div>
    );
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
      </div>

      <div className="flex flex-1 gap-4">
        {/* Left */}
        <div className="w-1/4 bg-[#1F4068] p-4 rounded space-y-4">
          <h2 className="font-bold">Question</h2>
          <p>{question.title}</p>
          <h3 className="font-bold">Description</h3>
          <p>{question.description}</p>
          <h3 className="font-bold">Test Cases</h3>
          {question.test_cases.map((tc, i) => (
            <div key={i} className="bg-[#283E6B] p-2 rounded mb-1">
              <b>Input:</b> {tc.input} <br />
              <b>Expected:</b> {tc.expected_output}
            </div>
          ))}
        </div>

        {/* Center */}
        <div className="w-2/4 flex flex-col space-y-4">
          <Editor
            height="400px"
            language={language === "cpp" ? "cpp" : language}
            theme="vs-dark"
            value={code}
            onChange={(v) => setCode(v)}
            options={{ fontSize: 14, minimap: { enabled: false } }}
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
            <span>{currentQuestionIndex + 1}</span>
            <button
              onClick={handleNext}
              disabled={currentQuestionIndex === contest.questions.length - 1}
              className="bg-[#6B8AFF] px-3 py-1 rounded"
            >
              Next
            </button>
          </div>
        </div>

        {/* Right */}
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

      {/* Footer */}
      <div className="flex justify-end gap-4 mt-4">
        <button
          onClick={handleEndContest}
          className="bg-[#FF6B6B] px-4 py-2 rounded text-white"
        >
          End Contest
        </button>
        <button
          onClick={handleRunCode}
          className="bg-[#6B8AFF] px-4 py-2 rounded text-black font-bold"
        >
          {loading ? "Running..." : "Run Code"}
        </button>
        <button
          onClick={handleSubmitCode}
          disabled={question.submitted}
          className={`px-4 py-2 rounded font-bold ${
            question.submitted
              ? "bg-gray-500 text-white cursor-not-allowed"
              : "bg-green-500 text-black"
          }`}
        >
          {question.submitted ? "Submitted" : "Submit Code"}
        </button>
      </div>
    </div>
  );
};

export default CodeRoom;
