import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setLoading } from '../store/authslice';
import Home from '../pages/Home';
import { useDispatch, useSelector } from 'react-redux';
import { Api_URL } from '../utils/Api_url';

const LoginForm = () => {
  const [teckziteId, setTeckziteId] = useState('');
  const [quizpassword, setQuizPassword] = useState('');
  const [showquiz, setShowQuiz] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const quizid = queryParams.get('quizid');
  const loading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    if (!quizid) {
      dispatch(setLoading(true));
      navigate('/');
    }
  }, [quizid, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${Api_URL}/user/login?quizid=${quizid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teckziteId, quizpassword }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('Teckziteid', teckziteId);
        localStorage.setItem('quizId', data.quizid);
        localStorage.setItem('logintoken', data.logintoken);
        setShowQuiz(true);
      } else {
        throw new Error('Wrong credentials. Please try again.');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };
  return showquiz ? (
    <Home />
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold text-center text-cyan-400 mb-8">Quiz Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-2">Teckzite ID</label>
            <input
              type="text"
              value={teckziteId}
              onChange={(e) => setTeckziteId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-2">Quiz Password</label>
            <input
              type="password"
              value={quizpassword}
              onChange={(e) => setQuizPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-500 text-gray-900 py-2 px-4 rounded-lg hover:bg-cyan-400 transition duration-200 font-semibold"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
