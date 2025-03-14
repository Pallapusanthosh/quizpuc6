import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ThankYou() {
  const navigate = useNavigate();
  const [closeFailed, setCloseFailed] = useState(false);

  const handleExit = () => {
    // Attempt to close the current tab
    const newWindow = window.open("", "_self");
    if (newWindow) {
      newWindow.close();
    }

    // Fallback: If closing fails, show a message after a short delay
    setTimeout(() => {
      setCloseFailed(true);
      // Optional: Redirect to a blank page or home as a fallback
      // window.location.href = 'about:blank';
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A192F] to-black flex flex-col items-center justify-center p-8">
      <div className="bg-[#112240]/50 backdrop-blur-sm p-10 rounded-xl border-2 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)] max-w-2xl w-full">
        <div className="text-center space-y-6">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-cyan-400 mb-4">
              Thank You!
            </h1>
            <p className="text-xl text-gray-300">
              Thank you for completing the quiz. We appreciate your effort and
              dedication!
            </p>
          </div>

          <div className="bg-[#1A2C4E]/50 p-6 rounded-lg border border-cyan-500/20 mb-8">
            <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
              What's Next?
            </h2>
            <ul className="space-y-3 text-gray-300 text-lg">
              <li className="flex items-center">
                <span className="mr-2 text-cyan-400">•</span>
                Your responses have been recorded
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-cyan-400">•</span>
                Results will be announced soon
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-cyan-400">•</span>
                Check your email for updates
              </li>
            </ul>
          </div>

          {/* <button
            onClick={handleExit}
            className="px-8 py-3 rounded-xl text-lg font-bold transition-all duration-300
                            bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400
                            text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]
                            hover:scale-105 border-2 border-cyan-400/50"
          >
            Exit Browser
          </button> */}

          {/* Fallback Message */}
          {closeFailed && (
            <p className="mt-4 text-red-400 text-lg">
              Unable to close the tab automatically. Please close it manually.
            </p>
          )}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}

export default ThankYou;
