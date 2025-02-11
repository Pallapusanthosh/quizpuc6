import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AttemptQuiz from '../components/QuizAttempt';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../store/authslice';

const Home = () => {
  const [quiz, setQuiz] = useState(null);
  const [attemptQuiz, setAttemptQuiz] = useState(false);
  const [teckziteId, setTeckziteId] = useState('');
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    const quizId = localStorage.getItem('quizId');
    const loginToken = localStorage.getItem('logintoken');
    const tzId = localStorage.getItem('Teckziteid');
    setTeckziteId(tzId);

    if (quizId && loginToken) {
      const fetchQuiz = async () => {
        dispatch(setLoading(true));
        try {
          const response = await axios.get(`http://localhost:4001/user/quiz?quizid=${quizId}`, {
            headers: { Authorization: `Bearer ${loginToken}` },
          });
          setQuiz(response.data);
        } catch (error) {
          console.error('Error fetching quiz:', error);
        } finally {
          dispatch(setLoading(false));
        }
      };
      fetchQuiz();
    }
  }, []);

  if (!quiz) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg m-3 p-6 w-full">
        {!attemptQuiz ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="m-3 p-6 border-4 border-blue-300 rounded-xl shadow-lg w-full max-w-lg">
              <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Quiz</h1>
              <div className="mb-6 text-center">
                <p className="text-lg font-semibold">Quiz Name: {quiz.quizName}</p>
                <h2 className="text-xl font-semibold text-gray-800 my-4">Quiz Rules:</h2>
                <ul className="list-disc pl-5 space-y-2 text-left inline-block text-gray-700">
                  <li>Read each question carefully before answering.</li>
                  <li>You will have limited time to complete the quiz.</li>
                  <li>Naviagate to a particular question by clicking the button on Sidebar</li> 
                  <li>No cheating or collaborating with others.</li>
                  <li>Once you start the quiz, you cannot pause it.</li>
                  <li>Good luck and have fun!</li>
                </ul>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <div className="text-lg text-gray-700 font-bold">Teckzite ID: {teckziteId}</div>
                <button
                  onClick={() => setAttemptQuiz(true)}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition duration-300 shadow-md"
                >
                  {loading ? 'Loading...' : 'Start Quiz'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <AttemptQuiz quiz={quiz} teckziteId={teckziteId} />
        )}
      </div>
    </div>
  );
};

export default Home;