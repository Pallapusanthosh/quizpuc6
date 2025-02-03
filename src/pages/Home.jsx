import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AttemptQuiz from '../components/QuizAttempt';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setLoading } from '../store/authslice';
const Home = () => {
  const [quiz, setQuiz] = useState(null);
  const [attemptQuiz, setAttemptQuiz] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const loading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    const quizId = localStorage.getItem('quizId');
    const loginToken = localStorage.getItem('logintoken');
    
    if (quizId && loginToken) {
      const fetchQuiz = async () => {
        dispatch(setLoading(true));
        try {
          const response = await axios.get(`http://localhost:4001/user/quiz?quizid=${quizId}`, {
            headers: { Authorization: `Bearer ${loginToken}` },
          });
          // alert(response.data.quizName);
          setQuiz(response.data);
        } catch (error) {
          console.error('Error fetching quiz:', error);
        }
        finally{
          dispatch(setLoading(false));
        }
      };
      fetchQuiz();
    }
  }, []);

  if (!quiz) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Quiz</h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quiz Rules:</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Read each question carefully before answering.</li>
            <li>You will have limited time to complete the quiz.</li>
            <li>No cheating or collaborating with others during the quiz.</li>
            <li>Once you start the quiz, you cannot pause it.</li>
            <li>Good luck and have fun!</li>
          </ul>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold">{quiz.quizName}</p>
          <div className="text-sm text-gray-600 ml-2">
            Teckzite ID: {localStorage.getItem('Teckziteid')}
          </div>
          {!attemptQuiz && (
            <button
              onClick={() => setAttemptQuiz(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 ml-4"
            >
             {loading ? 'Loading...' : 'Start Quiz'}

            </button>
          )}
        </div>

        {attemptQuiz && <AttemptQuiz quiz={quiz} />}
      </div>
    </div>
  );
};

export default Home;
