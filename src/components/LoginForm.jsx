import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setLoading } from '../store/authslice';
import Home from '../pages/Home';
import { useDispatch, useSelector } from 'react-redux';

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
      const response = await fetch(`http://localhost:4001/user/login?quizid=${quizid}`, {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Quiz Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Teckzite ID</label>
            <input
              type="text"
              value={teckziteId}
              onChange={(e) => setTeckziteId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Password</label>
            <input
              type="password"
              value={quizpassword}
              onChange={(e) => setQuizPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
