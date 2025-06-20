import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { toast } from "react-toastify";
import Editor from "@monaco-editor/react";
import Modal from "react-modal"; // ✅ New: use react-modal

Modal.setAppElement("#root"); // required for accessibility

const CodeRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contest, setContest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [codes, setCodes] = useState([]);
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const videoRef = useRef(null);

  const judge0LangMap = {
    python: 71,
    java: 62,
    cpp: 54,
    c: 50,
  };

  const JUDGE0_URL =
    "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true";
  const judge0Headers = {
    "content-type": "application/json",
    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
    "X-RapidAPI-Key": "dcd2bcd14emshff3e79ab3b1fcdcp14b8b5jsn9959db0a0934",
  };

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await axios.get(`contests/contests/${id}/`);
        const updated = res.data.questions.map((q) => ({
          ...q,
          submitted: false,
        }));
        setContest({ ...res.data, questions: updated });
        setCodes(new Array(updated.length).fill(""));

        const startTime = new Date(res.data.start_time);
        const endTime = new Date(
          startTime.getTime() + res.data.duration * 60000
        );
        const now = new Date();
        setTimeLeft(endTime - now);

        const interval = setInterval(() => {
          const now = new Date();
          const diff = endTime - now;
          if (diff <= 0) {
            clearInterval(interval);
            toast.info("Time's up! Submitting...");
            handleSubmitAll();
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

  const formatTimeLeft = (ms) => {
    if (ms <= 0) return "00:00";
    const s = Math.floor(ms / 1000);
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${m}:${sec}`;
  };

  const handleRunCode = async () => {
    if (!contest) return;
    setLoading(true);
    setOutput("");
    try {
      const langId = judge0LangMap[language];
      if (!langId) throw new Error("Unsupported lang");

      const question = contest.questions[currentQuestionIndex];
      let results = [];
      let passedCount = 0;

      for (const [i, tc] of question.test_cases.entries()) {
        const res = await axios.post(
          JUDGE0_URL,
          {
            source_code: codes[currentQuestionIndex],
            language_id: langId,
            stdin: tc.input,
          },
          { headers: judge0Headers }
        );
        const result = res.data;
        const out = (result.stdout || "").trim();
        const expected = tc.expected_output.trim();
        const passed = out === expected;
        if (passed) passedCount += 1;
        results.push(
          `Test ${i + 1}: ${passed ? "✅ Passed" : "❌ Failed"}\nInput: ${tc.input
          }\nOutput: ${out}\nExpected: ${expected}\n`
        );
      }

      // ✅ Save passed count for this question
      const updatedQuestions = [...contest.questions];
      updatedQuestions[currentQuestionIndex].passedTestCases = passedCount;
      setContest({ ...contest, questions: updatedQuestions });

      setOutput(results.join("\n"));
    } catch (err) {
      console.error(err);
      toast.error("Judge0 error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAll = async () => {
    if (!contest) return;

    setLoading(true);
    try {
      const payload = {
        submissions: contest.questions.map((q, i) => ({
          question_id: q.id,
          language: language,
          code: codes[i],
          passed_test_cases: q.passedTestCases || 0,
        })),
      };

      const res = await axios.post(`contests/${id}/submit-all/`, payload);
      const total = res.data.total_score;
      setFinalScore(total);
      setModalIsOpen(true);

      // After short delay, go back to contests page:
      setTimeout(() => {
        navigate("/contests");
      }, 5000);

    } catch (err) {
      console.error(err);
      toast.error("Submit all failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setOutput("");
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < contest.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setOutput("");
    }
  };

  const handleEndContest = () => {
    handleSubmitAll();
  };

  if (!contest) {
    return (
      <div className="p-6 text-center text-gray-300">Loading contest...</div>
    );
  }

  const question = contest.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-[#E0E0E0] p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-bold">{contest.title}</div>
        <div className="text-md font-mono bg-[#1F4068] px-4 py-1 rounded">
          Timer: {formatTimeLeft(timeLeft)}
        </div>
      </div>

      <div className="flex flex-1 gap-4">
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

        <div className="w-2/4 flex flex-col space-y-4">
          <Editor
            height="400px"
            language={language === "cpp" ? "cpp" : language}
            theme="vs-dark"
            value={codes[currentQuestionIndex]}
            onChange={(v) => {
              const newCodes = [...codes];
              newCodes[currentQuestionIndex] = v;
              setCodes(newCodes);
            }}
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
        </div>
      </div>

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
        {currentQuestionIndex === contest.questions.length - 1 && (
          <button
            onClick={handleSubmitAll}
            className="px-4 py-2 rounded font-bold bg-green-500 text-black"
          >
            Submit All
          </button>
        )}
      </div>

      {/* ✅ Score Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="bg-white rounded-lg p-8 w-1/3 mx-auto mt-40 text-center"
      >
        <h2 className="text-xl font-bold mb-4">🎉 Contest Submitted!</h2>
        <p>Your Total Score: <b>{finalScore}</b></p>
        <p>Redirecting to contests page...</p>
        <button
          onClick={() => {
            setModalIsOpen(false);
            navigate("/contests");
          }}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Close Now
        </button>
      </Modal>
    </div>
  );
};

export default CodeRoom;
