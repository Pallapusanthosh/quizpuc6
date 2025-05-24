import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AttemptQuiz from '../components/QuizAttempt';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../store/authslice';
import { Api_URL } from '../utils/Api_url';

const Home = () => {
  const [quiz, setQuiz] = useState(null);
  const [attemptQuiz, setAttemptQuiz] = useState(false);
  const [teckziteId, setTeckziteId] = useState('');
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const containerRef = useRef(null);
  const [fullscreenKey, setFullscreenKey] = useState(0); // to force remount AttemptQuiz

  useEffect(() => {
    const quizId = localStorage.getItem('quizId');
    const loginToken = localStorage.getItem('logintoken');
    const tzId = localStorage.getItem('Teckziteid');
    setTeckziteId(tzId);

    if (quizId && loginToken) {
      const fetchQuiz = async () => {
        dispatch(setLoading(true));
        try {
          const response = await axios.get(`${Api_URL}/user/quiz?quizid=${quizId}`, {
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

    useEffect(() => {
  
      // Disable right-click
      const disableRightClick = (e) => {
        e.preventDefault();
      };
      document.addEventListener("contextmenu", disableRightClick);
      return () => {
        document.removeEventListener("contextmenu", disableRightClick);
      };
    }, []);

  const handleStartQuiz = async () => {
    setAttemptQuiz(true);
    setFullscreenKey(prev => prev + 1); // force remount for clean event binding
    setTimeout(() => {
      if (containerRef.current && containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current && containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current && containerRef.current.mozRequestFullScreen) {
        containerRef.current.mozRequestFullScreen();
      } else if (containerRef.current && containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
    }, 0);
  };

  if (!quiz) return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A192F] to-black flex justify-center items-center">
      <div className="text-cyan-400 text-2xl font-bold animate-pulse">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A192F] to-black">
      <div className="min-h-screen  overflow-auto " ref={containerRef}>
        {!attemptQuiz ? ( 
          <div className="flex justify-center items-center min-h-screen p-4">
            <div className="bg-[#112240]/50 backdrop-blur-sm p-8 rounded-xl border-2 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)] w-full max-w-2xl">
              <h1 className="text-4xl font-bold text-cyan-400 text-center mb-8">
                {quiz.quizName}
              </h1>
              <div className="mb-8">
                <p className="text-lg text-gray-300 text-center mb-6">
                  {quiz.quizDesc}
                </p>
                <h2 className="text-2xl font-semibold text-cyan-400 mb-4 text-center">Quiz Rules</h2>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center">
                    <span className="mr-2 text-cyan-400">•</span>
                    Read each question carefully before answering
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-cyan-400">•</span>
                    You will have {quiz.quizTime} minutes to complete the quiz
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-cyan-400">•</span>
                    Navigate to questions using the sidebar buttons
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-cyan-400">•</span>
                    Single click to select an option, double click to deselect
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-cyan-400">•</span>
                    No cheating or collaborating with others
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-cyan-400">•</span>
                    Once started, the quiz cannot be paused
                  </li>
                </ul>
              </div>

              <div className="flex flex-col items-center space-y-6">
                <div className="bg-[#1A2C4E] px-6 py-3 rounded-lg border-2 border-cyan-500/30">
                  <span className="text-cyan-400 font-bold">Teckzite ID: </span>
                  <span className="text-gray-300">{teckziteId}</span>
                </div>
                
                <button
                  onClick={handleStartQuiz}
                  className="px-8 py-3 rounded-xl text-lg font-bold transition-all duration-300
                    bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400
                    text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]
                    hover:scale-105 border-2 border-cyan-400/50"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    'Start Quiz'
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <AttemptQuiz
            key={fullscreenKey}
            quiz={quiz}
            teckziteId={teckziteId}
            fullscreenContainerRef={containerRef}
          />
        )}
      </div>
    </div>
  );
};

export default Home;