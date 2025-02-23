import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setLoading } from "../store/authslice";
import { Api_URL } from "../utils/Api_url";

const AttemptQuiz = ({ quiz, teckziteId }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState(new Set());
  const questionRefs = useRef([]);
  const defaultTime = 10 * 60; // Default to 10 minutes in seconds
  const quizTime = quiz.quizTime ? parseInt(quiz.quizTime) * 60 : defaultTime;
  const [timeLeft, setTimeLeft] = useState(quizTime);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [randomizedQuestions, setRandomizedQuestions] = useState([]);
  
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
    // Shuffle questions
    const shuffledQuestions = [...quiz.questions].map(question => ({
      ...question,
      // Shuffle options and keep track of original indices
      options: question.options.map((opt, index) => ({
        text: opt,
        originalIndex: index // Keep track of original index (0=A, 1=B, etc.)
      }))
      .sort(() => Math.random() - 0.5)
    })).sort(() => Math.random() - 0.5);

    setRandomizedQuestions(shuffledQuestions);
  }, [quiz]);

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
          clearInterval(timer);
          if (!isSubmitted) {
            setIsSubmitted(true);
            handleSubmit(false);
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted]);

  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
    setVisitedQuestions((prev) => new Set(prev).add(randomizedQuestions[index].questionid));
    questionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleOptionChange = (questionId, optionIndex) => {
    const question = randomizedQuestions.find(q => q.questionid === questionId);
    const originalOption = ['A', 'B', 'C', 'D'][question.options[optionIndex].originalIndex];
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: originalOption }));
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
    if (isSubmitting || isSubmitted) return;
    setIsSubmitting(true);
    const windowshow = show ? window.confirm('Are you sure you want to submit the quiz?') : true;
    if (isSubmitted || windowshow) {
      try {
        const response = await axios.post(
          `${Api_URL}/user/submit-quiz`,
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
        setIsSubmitted(true);
      } catch (error) {
        console.error('Error submitting quiz:', error);
        alert('An error occurred while submitting the quiz. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  }, [selectedAnswers, isSubmitting, isSubmitted]);

  useEffect(() => {
    if (isSubmitted) {
      dispatch(setLoading(false));
      navigate('/thankyou');
    }
  }, [isSubmitted, navigate, dispatch]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours > 0 ? `${hours.toString().padStart(2, "0")}:` : ""}${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0A192F] to-black text-gray-100">
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full bg-[#0A192F]/80 backdrop-blur-sm p-4 flex justify-between items-center z-20 border-b border-cyan-500/20">
        <div className="flex items-center space-x-4">
          <div className="bg-[#112240] p-2 rounded-lg border border-cyan-500/30">
            <span className="text-cyan-400 font-bold text-lg">
              ⏳ Time Left : {formatTime(timeLeft)}
            </span>
          </div>
          <div className="bg-[#112240] p-2 rounded-lg border border-purple-500/30">
            <span className="text-purple-400 font-bold text-lg">
              🆔 TeckziteId : {teckziteId}
            </span>
          </div>
        </div>
      </div>

      <div className="flex pt-20">
        {/* Sidebar */}
        <div className="w-[350px] p-4 bg-[#0A192F]/90 backdrop-blur-sm border-r-[1px] border-r-cyan-500/20 border-0 h-[calc(100vh-80px)] fixed left-0 top-20 overflow-y-auto">
          <h3 className="text-xl font-bold mb-4 text-cyan-400">Questions</h3>
          <div className="grid grid-cols-4 gap-2">
            {randomizedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(index)}
                className={`h-10 w-full flex items-center justify-center rounded-lg transition-all duration-300
                  ${
                    currentQuestionIndex === index
                      ? 'bg-cyan-500/40 ring-2 ring-cyan-400 scale-105 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : ''
                  }
                  ${
                    selectedAnswers[question.questionid]
                      ? "bg-green-500/40 text-green-300 border-2 border-green-400"
                      : visitedQuestions.has(question.questionid)
                      ? "bg-amber-500/40 text-amber-300 border-2 border-amber-400"
                      : "bg-[#112240] text-gray-300 hover:bg-cyan-500/20 border-2 border-gray-600 hover:border-cyan-400"
                  }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          <div className="mt-6 bg-[#112240] p-4 rounded-xl border border-cyan-500/30">
            <h4 className="text-lg font-bold text-cyan-400 mb-3">Rules:</h4>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
              <li>if the color of the option is green then the option is visited and selected</li>
              <li>if the color of the option is yellow then the option is visited and not selected</li>
              <li>if the color of the option is blue then the option is not visited and notselected</li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-80 p-6 w-[calc(100vw-256px)]">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 text-center bg-[#112240]/50 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/20">
              <div className="mb-4">
                <h1 className="text-4xl font-bold text-cyan-400 mb-2">
                  Quiz Name : {quiz.quizName}
                </h1>
                <p className="text-lg text-gray-300">
                  Quiz Description : {quiz.quizDesc}
                </p>
              </div>
            </div>

            {randomizedQuestions.map((question, index) => (
              <div
                key={question.questionid}
                ref={(el) => (questionRefs.current[index] = el)}
                className={`mb-6 p-6 bg-[#112240]/50 backdrop-blur-sm rounded-xl border border-cyan-500/20
                  ${currentQuestionIndex === index ? "ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]" : ""}`}
              >
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-100">
                    <span className="mr-2 text-cyan-400">Q{index + 1}.</span>
                    {question.questionText}
                  </h3>
                  
                  {/* Question Image */}
                  {question.questionimage && (
                    <div className="my-4 flex justify-center items-center">
                      <img 
                        src={question.questionimage} 
                        alt="Question Image"
                        className="w-[400px] h-[400px] object-contain rounded-lg border-2 border-cyan-500/30"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {question.options.map((option, i) => (
                      <label
                        key={i}
                        className={`relative flex items-center p-4 rounded-xl cursor-pointer
                          transition-all duration-300 ${
                            selectedAnswers[question.questionid] === ['A', 'B', 'C', 'D'][option.originalIndex]
                              ? 'bg-green-500/30 border-2 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                              : 'bg-[#1A2C4E] hover:bg-cyan-500/20 border-2 border-cyan-600/30 hover:border-cyan-400'
                          }`}
                        onClick={() => handleOptionChange(question.questionid, i)}
                        onDoubleClick={() => handleOptionDoubleClick(question.questionid, ['A', 'B', 'C', 'D'][option.originalIndex])}
                      >
                        <input
                          type="radio"
                          name={`question-${question.questionid}`}
                          value={['A', 'B', 'C', 'D'][option.originalIndex]}
                          checked={selectedAnswers[question.questionid] === ['A', 'B', 'C', 'D'][option.originalIndex]}
                          onChange={() => {}}
                          className="hidden"
                        />
                        <div className="flex items-center w-full text-base">
                          <span className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 
                            ${selectedAnswers[question.questionid] === ['A', 'B', 'C', 'D'][option.originalIndex]
                              ? 'bg-green-500/40 text-green-300 border-2 border-green-400' 
                              : 'bg-[#112240] text-cyan-300 border-2 border-cyan-500'} 
                            `}
                          >
                            {['A', 'B', 'C', 'D'][option.originalIndex]}
                          </span>
                          <span className={`${
                            selectedAnswers[question.questionid] === ['A', 'B', 'C', 'D'][option.originalIndex]
                              ? 'text-green-300' 
                              : 'text-cyan-300'
                          }`}>
                            {option.text}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="fixed bottom-6 right-6 bg-[#112240]/80 backdrop-blur-sm p-4 rounded-xl border border-cyan-500/20">
            <button
              onClick={() => handleSubmit(true)}
              className="px-8 py-3 rounded-xl text-lg font-bold transition-all duration-300
                bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400
                text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]
                hover:scale-105 border-2 border-cyan-400/50"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Quiz'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttemptQuiz;