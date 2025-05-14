import React from "react";

function DesktopOnlyPage() {
  return (
    <div className="flex items-center md:hidden justify-center min-h-screen bg-gradient-to-br from-itccolor to-orange-600">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Desktop Experience Only
        </h1>
        <p className="text-gray-600 mb-6">
          This page is optimized for desktop users. Please switch to a desktop device for the best experience.
        </p>
        <div className="text-itccolor text-5xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17.75L11 17.75M7.25 14L11 10L14.75 14M17.25 14V16.25A2.75 2.75 0 0114.5 19H9.5A2.75 2.75 0 016.75 16.25V14" />
          </svg>
        </div>
        <p className="text-gray-500 italic">Thank you for understanding!</p>
      </div>
    </div>
  );
}

export default DesktopOnlyPage;
