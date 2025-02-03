import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoading } from '../store/authslice';
import { useSelector } from 'react-redux';
const AttemptQuiz = ({ quiz }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(quiz.quizTime* 60); 
  const loading = useSelector((state) => state.auth.loading);
  const navigate = useNavigate();
   const dispatch     = useDispatch();
  const handleSubmit = useCallback(async () => {
    if (window.confirm('Are you sure you want to submit the quiz?')) {
      dispatch(setLoading(true));
      try {
        const response = await axios.post('http://localhost:4001/user/submit-quiz', {
          quizid: localStorage.getItem('quizId'),
          teckziteId: localStorage.getItem('Teckziteid'),
          answers: Object.entries(selectedAnswers).map(([questionId, selectedOption]) => ({
            questionId,
            selectedOption:{ A: 1, B: 2, C: 3, D: 4 }[selectedOption],
          })),
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('logintoken')}`
          }
        });
        alert(response.data.message);

        navigate('/');
      } catch (error) {
        console.error('Error submitting quiz:', error);
        alert('An error occurred while submitting the quiz. Please try again.');
      }finally{
        dispatch(setLoading(false));
      }
    }
  }, [selectedAnswers, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleSubmit]);

  const handleOptionChange = (questionId, option) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const allQuestionsAnswered = quiz.questions.every(question => selectedAnswers[question.questionid] !== undefined);

  return (
    <div className="w-full p-6">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">{quiz.quizName}</h2>
      <p className="mb-4 text-lg font-semibold">
        Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
      </p>
      {quiz.questions.map((question, index) => (
        <div key={question.questionid} className="mb-8 p-4 bg-gray-100 rounded-lg shadow-md">
          {question.questionimage &&  <img src={question.questionimage} style={{ height: '400px', width: '400px' }} />}
           

          <p className="text-xl font-semibold mb-4 text-gray-800">{index + 1}. {question.questionText}</p>
          {['A', 'B', 'C', 'D'].map((option, i) => (
            <label
              key={i}
              className={`block cursor-pointer p-2 rounded-lg text-lg font-medium transition-colors duration-200 ${selectedAnswers[question.questionid] === option ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800 border border-gray-300 hover:bg-indigo-50'}`}
            >
              <input
                type="radio"
                name={`question-${question.questionid}`} // Use questionid here
                value={option}
                checked={selectedAnswers[question.questionid] === option}
                onChange={() => handleOptionChange(question.questionid, option)}
                className="mr-2 sr-only"
              />
              {option}: {question.options[i]}
            </label>
          ))}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={!allQuestionsAnswered}
        className={`px-6 py-3 rounded-lg text-lg font-semibold ${allQuestionsAnswered ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
      >
        {loading ? 'Submitting Quiz...' : 'Submit Quiz'}
      </button>
    </div>
  );
};

export default AttemptQuiz;