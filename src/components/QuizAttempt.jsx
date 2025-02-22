import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setLoading } from "../store/authslice";

const AttemptQuiz = ({ quiz, teckziteId }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState(new Set());
  const questionRefs = useRef([]);
  const defaultTime = 10 * 60; // Default to 10 minutes in seconds
  const quizTime = quiz.quizTime ? quiz.quizTime * 60 : defaultTime; // Convert minutes to seconds
  const [timeLeft, setTimeLeft] = useState(quizTime);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // New state to track submission
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    if (isSubmitting) {
      dispatch(setLoading(true));
    } else {
      dispatch(setLoading(false));
    }
  }, [isSubmitting, dispatch]);

 
  useEffect(() => {
    questionRefs.current[currentQuestionIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }, [currentQuestionIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer); // Stop the timer immediately
          if (!isSubmitted) {
            setIsSubmitted(true); // Mark as submitted first
            handleSubmit(false); // Then submit
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [isSubmitted]); // Depend only on isSubmitted

  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
    setVisitedQuestions((prev) => new Set(prev).add(quiz.questions[index].questionid));
    questionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleOptionChange = (questionId, option) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleOptionDoubleClick = (questionId, option) => {
    setSelectedAnswers((prev) => {
      if (prev[questionId] === option) {
        const { [questionId]: _, ...rest } = prev;
        return rest;
      }
      return prev;
    });
  };

  const handleSubmit = useCallback(async (show) => {
    if (isSubmitting || isSubmitted) return; // Prevent multiple submissions
    setIsSubmitting(true);
    const windowshow = show ? window.confirm('Are you sure you want to submit the quiz?') : true; 
    if (isSubmitted || windowshow) {
      try {
        const response = await axios.post(
          'http://localhost:4001/user/submit-quiz',
          {
            quizid: localStorage.getItem('quizId'),
            teckziteId: localStorage.getItem('Teckziteid'),
            answers: Object.entries(selectedAnswers).map(([questionId, selectedOption]) => ({
              questionId,
              selectedOption: { A: 1, B: 2, C: 3, D: 4 }[selectedOption],
            })),
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('logintoken')}`,
            },
          }
        );
  
        alert(response.data.message);
        setIsSubmitted(true); // Ensure submission state updates properly
      } catch (error) {
        console.error('Error submitting quiz:', error);
        alert('An error occurred while submitting the quiz. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  }, [selectedAnswers, navigate, isSubmitting, isSubmitted]);
  
  // Redirect user after successful submission
  useEffect(() => {
    if (isSubmitted) {
      dispatch(setLoading(false));
      navigate('/thankyou');
    }
  }, [isSubmitted, navigate]);
  

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours > 0 ? `${hours.toString().padStart(2, "0")}:` : ""}${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full bg-white p-4 flex justify-between items-center shadow-lg z-20 border-b border-gray-500">
        <div className="flex items-center space-x-4">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <span className="text-indigo-700 font-bold text-lg">
              ⏳ Time Left : {formatTime(timeLeft)}
            </span>
          </div>
          <div className="bg-emerald-100 p-2 rounded-lg">
            <span className="text-emerald-700 font-bold text-lg">
              🆔 TeckziteId : {teckziteId}
            </span>
          </div>
        </div>
      </div>

      <div className="flex pt-20">
        {/* Sidebar */}
        <div className="w-72 p-4 bg-white border-r border-gray-500 h-[calc(100vh-80px)] fixed left-0 top-20 overflow-y-auto">
          <h3 className="text-xl font-bold mb-4 text-gray-700">Questions</h3>
          <div className="grid grid-cols-3 gap-3">
            {quiz.questions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(index)}
                className={`h-12 w-full flex items-center justify-center rounded-lg transition-all
                  ${
                    currentQuestionIndex === index
                      ? 'ring-2 ring-indigo-500 scale-105'
                      : ''
                  }
                  ${
                    selectedAnswers[question.questionid]
                      ? "bg-green-500 text-white"
                      : visitedQuestions.has(question.questionid)
                      ? "bg-amber-500 text-amber-800 border border-amber-500"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                <div className="flex items-center">
                  <span className="font-medium">{index + 1}</span>
                  {selectedAnswers[question.questionid] && (
                    <span className="ml-1"> </span>
                  )}
                </div>
              </button>
            ))}
          </div>
          <div className="mt-6">
            <h4 className="text-lg font-bold text-gray-700">Rules:</h4>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>If the option is selected, the background color is green.</li>
              <li>If the option is visited and not selected, it is yellow.</li>
              <li>If it is white, it is not visited and not selected.</li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-72 p-8 w-[calc(100vw-288px)] -mt-8 border-l border-gray-500"> {/* Adjusted margin-top */}
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                 Quiz Name : {quiz.quizName}
              </h1>
              <p className="text-lg text-gray-600">
                Quiz Description : {quiz.quizDesc}</p>
            </div>

            {quiz.questions.map((question, index) => (
              <div
                key={question.questionid}
                ref={(el) => (questionRefs.current[index] = el)}
                className={`mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-500
                  ${currentQuestionIndex === index ? "ring-2 ring-indigo-500" : ""}`}
              >
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    <span className="mr-2 text-indigo-600">Q{index + 1}.</span>
                    {question.questionText}
                  </h3>
                  {question.questionimage && (
                    <div className="mb-6 flex justify-center">
                      <img
                        src={question.questionimage}
                        alt="Question"
                        className="max-h-[350px] max-w-full object-contain rounded-lg"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["A", "B", "C", "D"].map((option, i) => (
                      <label
                        key={i}
                        className={`relative flex items-center p-4 rounded-xl cursor-pointer
                          transition-all border-2 ${
                            selectedAnswers[question.questionid] === option
                              ? 'border-black-500 bg-green-500'
                              : 'border-gray-700 hover:border-indigo-300 bg-white'
                          }`}
                        onDoubleClick={() => handleOptionDoubleClick(question.questionid, option)}
                      >
                        <input
                          type="radio"
                          name={`question-${question.questionid}`}
                          value={option}
                          checked={selectedAnswers[question.questionid] === option}
                          onChange={() => handleOptionChange(question.questionid, option)}
                          className="absolute opacity-0"
                        />
                        <div className={`flex items-center w-full ${
                          selectedAnswers[question.questionid] === option
                            ? 'text-white-800'
                            : 'text-gray-900'
                        }`}>
                          <div className={`flex items-center justify-center h-8 w-8 mr-4 rounded
                            ${
                              selectedAnswers[question.questionid] === option
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                            {option}
                          </div>
                          <span className="text-lg">{question.options[i]}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Fixed Submit Button */}
          <div className="fixed bottom-6 right-6 bg-white p-4 rounded-xl shadow-lg border border-gray-500">
            <button
              onClick={()=>handleSubmit(true)}
              className={`px-8 py-3 rounded-xl text-lg font-bold transition-transform
                ${
                  'bg-green-600 hover:bg-green-700 text-white shadow-md hover:scale-105'
                }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
                    {/* Spinner SVG */}
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Quiz '
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttemptQuiz;