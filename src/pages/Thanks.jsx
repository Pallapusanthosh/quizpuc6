import React from 'react';
import { useNavigate } from 'react-router-dom';

function ThankYou() {
    return (
        <div className="bg-blue-300 min-h-screen flex flex-col items-center justify-center p-8">
            <div className="bg-white p-10 rounded-lg shadow-lg text-center">
                <h1 className="text-4xl font-bold text-blue-900 mb-4">Thank You!</h1>
                <p className="text-lg text-gray-700 mb-6">Thank you for attempting the quiz. We appreciate your effort and hope you enjoyed it!</p>
               
            </div>
        </div>
    );
}

export default ThankYou;