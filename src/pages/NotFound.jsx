import React from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A192F] to-black flex flex-col items-center justify-center p-8">
      <div className="bg-[#112240]/50 backdrop-blur-sm p-10 rounded-xl border-2 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)] max-w-2xl w-full">
        <div className="text-center space-y-6">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-cyan-400 mb-4">404</h1>
            <p className="text-2xl text-gray-300">Oops! Page Not Found</p>
            <p className="text-lg text-gray-400 mt-2">
              It seems you've ventured into uncharted territory. The page you're
              looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="bg-[#1A2C4E]/50 p-6 rounded-lg border border-cyan-500/20 mb-8">
            <h2 className="text-xl font-semibold text-cyan-400 mb-4">
              What Now?
            </h2>
            <ul className="space-y-3 text-gray-300 text-lg">
              <li className="flex items-center">
                <span className="mr-2 text-cyan-400">•</span>
                Check the URL for typos
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-cyan-400">•</span>
                Contact support if you need help
              </li>
            </ul>
          </div>

          {/* <button
            onClick={() => navigate("/")} // Redirects to homepage
            className="px-8 py-3 rounded-xl text-lg font-bold transition-all duration-300
                            bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400
                            text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]
                            hover:scale-105 border-2 border-cyan-400/50"
          >
            Go to Homepage
          </button> */}
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

export default NotFound;
