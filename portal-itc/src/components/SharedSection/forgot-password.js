import React from "react";
import { Mail, User, Hash, ShieldCheck } from 'lucide-react';
import Footer from '../SharedNav/Footer';
import TopNav from '../SharedNav/Topvabae';
import Navbar from '../SharedNav/Navbar';
function ForgotPassword() {

  
    return (
          <>
            <TopNav />
      <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-white px-4 py-10">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
              🔐 Account Recovery
            </h2>
    
            <p className="text-sm sm:text-base text-gray-600 text-center">
              Can’t access your account? Don’t worry, follow the steps below to recover it.
            </p>
    
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <ShieldCheck className="text-blue-500 w-6 h-6 mt-1" />
                <p className="text-sm sm:text-base text-gray-700">
                  <strong>Step 1:</strong> Contact your <span className="font-medium text-blue-600">ICT Admin</span>.
                </p>
              </div>
    
              <div className="flex items-start space-x-3">
                <User className="text-green-500 w-6 h-6 mt-1" />
                <p className="text-sm sm:text-base text-gray-700">
                  <strong>Step 2:</strong> Provide your <span className="font-medium">Full Name</span>.
                </p>
              </div>
    
              <div className="flex items-start space-x-3">
                <Mail className="text-red-500 w-6 h-6 mt-1" />
                <p className="text-sm sm:text-base text-gray-700">
                  <strong>Step 3:</strong> Provide your <span className="font-medium">Email Address</span>.
                </p>
              </div>
    
              <div className="flex items-start space-x-3">
                <Hash className="text-purple-500 w-6 h-6 mt-1" />
                <p className="text-sm sm:text-base text-gray-700">
                  <strong>Step 4:</strong> Provide your <span className="font-medium">Application Number</span>.
                </p>
              </div>
    
              <div className="flex items-start space-x-3">
                <ShieldCheck className="text-yellow-500 w-6 h-6 mt-1" />
                <p className="text-sm sm:text-base text-gray-700">
                  <strong>Step 5:</strong> Wait for your <span className="font-medium text-green-600">password reset</span>. The ICT Admin will confirm by contacting you.
                </p>
              </div>
            </div>
    
            <div className="text-center mt-6">
              <p className="text-xs sm:text-sm text-gray-500 italic">
                Ensure your contact details are correct for smooth communication.
              </p>
            </div>
          </div>
            </div>
            <Footer />

            </>

      );
    }
    


export default ForgotPassword;
