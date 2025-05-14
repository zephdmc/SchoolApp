import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const TopNav = () => {
  return (
    <div className="bg-itccolor w-full h-8 hidden lg:block lg:px-[12%] px-[2%] md:px-[5%] text-white text-sm">
      <div className=" mx-auto flex justify-between items-center py-2 px-4">
        {/* Left Side: Contact Information */}
        <div className="flex text-sm items-center space-x-4">
          <span><strong>|</strong> 123 Main Owerri, Nigeria</span>
          <span><strong>|</strong> +234 800 123 4567</span>
          <span><strong>|</strong> itc@imostate.gov.ng</span>
        </div>

        {/* Right Side: Social Media Links */}
        <div className="flex items-center space-x-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
            <FaFacebookF />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
            <FaTwitter />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
            <FaInstagram />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700">
            <FaLinkedinIn />
          </a>
        </div> 
      </div>
    </div>
  );
};
export default TopNav;
