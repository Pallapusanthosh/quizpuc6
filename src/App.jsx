import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";
import LoginForm from "./components/LoginForm";
import Home from "./pages/Home";
import AttemptQuiz from "./components/QuizAttempt";
import Loadingbar from "./components/Loadingbar";

import ThankYou from "./pages/Thanks";
import NotFound from "./pages/NotFound";

const RequireQuizId = ({ children }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const quizid = queryParams.get("quizid");

  return quizid ? children : <Navigate to="/" replace />;
};

function App() {
  const isLoading = useSelector((state) => state.auth.isLoading); // Moved here

  return (
    <>
      {isLoading && <Loadingbar />}
      <Router>
        <Routes>
          <Route
            path="/user/attempt"
            element={
              <RequireQuizId>
                <LoginForm />
              </RequireQuizId>
            }
          />
          <Route path="/home" element={<Home />} />
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
          <Route path="/AttemptQuiz" element={<AttemptQuiz />} />
          <Route path="/thankyou" element={<ThankYou />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
