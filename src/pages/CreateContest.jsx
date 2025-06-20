import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const CreateContest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    start_time: "",
    questions: [
      {
        title: "",
        description: "",
        marks: "",
        test_cases: [{ input: "", expected_output: "" }],
      },
    ],
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleQuestionChange = (index, e) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][e.target.name] = e.target.value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleTestCaseChange = (qIndex, tIndex, e) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex].test_cases[tIndex][e.target.name] = e.target.value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          title: "",
          description: "",
          marks: "",
          test_cases: [{ input: "", expected_output: "" }],
        },
      ],
    });
  };

  const addTestCase = (qIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex].test_cases.push({ input: "", expected_output: "" });
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");

      // Convert local datetime to UTC ISO format
      const localDate = new Date(formData.start_time);
      const isoWithTZ = localDate.toISOString();

      const formDataWithUTC = {
        ...formData,
        start_time: isoWithTZ,
      };

      await axios.post("/contests/create/", formDataWithUTC, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Contest created successfully!");
      setError("");
      setTimeout(() => navigate("/profile"), 2000);
    } catch (err) {
      console.error(err);
      setError("Failed to create contest. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <h2 className="text-2xl font-bold text-[#1F4068] mb-4 text-center">Create Contest</h2>
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-gray-100 p-6 rounded shadow space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Contest Title"
          className="w-full p-2 rounded border border-gray-300 text-gray-600"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Contest Description"
          className="w-full p-2 rounded border border-gray-300 text-gray-600"
          required
        />
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          placeholder="Duration (minutes)"
          className="w-full p-2 rounded border border-gray-300 text-gray-600"
          required
        />
        <input
          type="datetime-local"
          name="start_time"
          value={formData.start_time}
          onChange={handleChange}
          className="w-full p-2 rounded border border-gray-300 text-gray-600"
          required
        />

        {formData.questions.map((question, qIndex) => (
          <div key={qIndex} className="border p-4 rounded bg-white space-y-2">
            <h3 className="font-semibold text-lg text-[#1F4068]">Question {qIndex + 1}</h3>
            <input
              type="text"
              name="title"
              value={question.title}
              onChange={(e) => handleQuestionChange(qIndex, e)}
              placeholder="Question Title"
              className="w-full p-2 rounded border border-gray-300 text-gray-600"
              required
            />
            <textarea
              name="description"
              value={question.description}
              onChange={(e) => handleQuestionChange(qIndex, e)}
              placeholder="Question Description"
              className="w-full p-2 rounded border border-gray-300 text-gray-600"
              required
            />
            <input
              type="number"
              name="marks"
              value={question.marks}
              onChange={(e) => handleQuestionChange(qIndex, e)}
              placeholder="Marks"
              className="w-full p-2 rounded border border-gray-300 text-gray-600"
              required
            />

            {question.test_cases.map((tc, tIndex) => (
              <div key={tIndex} className="ml-4 space-y-1">
                <input
                  type="text"
                  name="input"
                  value={tc.input}
                  onChange={(e) => handleTestCaseChange(qIndex, tIndex, e)}
                  placeholder="Test Case Input"
                  className="w-full p-2 rounded border border-gray-300 text-gray-600"
                  required
                />
                <textarea
                  type="text"
                  name="expected_output"
                  value={tc.expected_output}
                  onChange={(e) => handleTestCaseChange(qIndex, tIndex, e)}
                  placeholder="Expected Output"
                  className="w-full p-2 rounded border border-gray-300 text-gray-600"
                  required
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() => addTestCase(qIndex)}
              className="mt-2 bg-[#6B8AFF] text-white px-3 py-1 rounded"
            >
              + Add Test Case
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="bg-[#6BFF6B] text-black px-4 py-2 rounded"
        >
          + Add Question
        </button>

        <button
          type="submit"
          className="w-full bg-[#1F4068] text-white p-2 rounded hover:bg-[#163356]"
        >
          Submit Contest
        </button>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        {success && <p className="text-green-600 text-center mt-2">{success}</p>}
      </form>
    </div>
  );
};

export default CreateContest;
