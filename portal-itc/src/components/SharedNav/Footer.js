import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-red-950 text-gray-300 py-8">
      <div className=" mx-auto px-4">
        <div className="flex flex-wrap justify-between mx-[20%]">
         
          <div className="text-left w-full sm:w-1/2 md:w-1/4 mb-4">
            <h5 className="text-xl font-bold mb-2">Support</h5>
            <ul className='text-left'>
              <li><a href="/Error" className="hover:underline">Help Center</a></li>
              <li><a href="/About" className="hover:underline">About Us</a></li>
              <li><a href="/Error" className="hover:underline">Careers</a></li>
              <li><a href="/Error" className="hover:underline">Press</a></li>
              <li><a href="/Contact" className="hover:underline">Contact Us</a></li>
              <li><a href="/faq" className="hover:underline">FAQs</a></li>
            </ul>
          </div>
          <div className="text-left w-full sm:w-1/2 md:w-1/4 mb-4">
            <h5 className="text-xl font-bold mb-2">Legal</h5>
            <ul>
              <li><a href="/Error" className="hover:underline">Privacy Policy</a></li>
              <li><a href="/Error" className="hover:underline">Terms of Service</a></li>
              <li><a href="/Error" className="hover:underline">Cookie Policy</a></li>
            </ul>
          </div>
          <div className="text-left w-full sm:w-1/2 md:w-1/4 mb-4">
            <h5 className="text-xl font-bold mb-2">Follow Us</h5>
            <ul className="flex space-x-4">
              <li>
                <a href="#" aria-label="Facebook" className="hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.623h3.128V8.414c0-3.1 1.893-4.788 4.657-4.788 1.325 0 2.463.099 2.795.143v3.24H18.42c-1.597 0-1.906.759-1.906 1.87v2.454h3.812l-.497 3.623h-3.315V24h6.486c.732 0 1.325-.593 1.325-1.324V1.325C24 .593 23.407 0 22.675 0z"/>
                  </svg>
                </a>
              </li>
              <li>
                <a href="#" aria-label="Twitter" className="hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557a9.93 9.93 0 01-2.828.775 4.933 4.933 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.917 4.917 0 00-8.38 4.482 13.944 13.944 0 01-10.11-5.134 4.822 4.822 0 001.524 6.574 4.903 4.903 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.889a4.934 4.934 0 01-2.224.084 4.919 4.919 0 004.59 3.417A9.867 9.867 0 010 21.54a13.94 13.94 0 007.548 2.212c9.142 0 14.307-7.72 14.307-14.416 0-.219-.005-.437-.014-.653A10.243 10.243 0 0024 4.557z"/>
                  </svg>
                </a>
              </li>
              <li>
                <a href="#" aria-label="Instagram" className="hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.259.058 2.091.25 2.577.415a5.092 5.092 0 011.826 1.039 5.092 5.092 0 011.039 1.826c.165.486.357 1.318.415 2.577.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.058 1.259-.25 2.091-.415 2.577a5.078 5.078 0 01-1.039 1.826 5.078 5.078 0 01-1.826 1.039c-.486.165-1.318.357-2.577.415-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.259-.058-2.091-.25-2.577-.415a5.078 5.078 0 01-1.826-1.039 5.078 5.078 0 01-1.039-1.826c-.165-.486-.357-1.318-.415-2.577-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.058-1.259.25-2.091.415-2.577a5.092 5.092 0 011.039-1.826 5.092 5.092 0 011.826-1.039c.486-.165 1.318-.357 2.577-.415C8.416 2.175 8.796 2.163 12 2.163m0-2.163C8.735 0 8.332.014 7.053.072 5.775.131 4.808.287 4.034.514a7.028 7.028 0 00-2.55 1.678 7.028 7.028 0 00-1.678 2.55c-.227.774-.383 1.741-.442 3.019C.014 8.332 0 8.735 0 12s.014 3.668.072 4.947c.059 1.278.215 2.245.442 3.019a7.024 7.024 0 001.678 2.55 7.024 7.024 0 002.55 1.678c.774.227 1.741.383 3.019.442C8.332 23.986 8.735 24 12 24s3.668-.014 4.947-.072c1.278-.059 2.245-.215 3.019-.442a7.024 7.024 0 002.55-1.678 7.024 7.024 0 001.678-2.55c.227-.774.383-1.741.442-3.019.059-1.278.072-1.682.072-4.947s-.014-3.668-.072-4.947c-.059-1.278-.215-2.245-.442-3.019a7.024 7.024 0 00-1.678-2.55 7.024 7.024 0 00-2.55-1.678c-.774-.227-1.741-.383-3.019-.442C15.668.014 15.265 0 12 0z"/>
                    <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.167a4.005 4.005 0 110-8.01 4.005 4.005 0 010 8.01zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/>
                  </svg>
                </a>
              </li>
            </ul>
           
          </div>
          <div className="text-left w-full md:w-1/2 lg:w-1/4 mb-4">
            <h5 className="text-xl font-bold mb-2">Sign Up to Our Newsletter</h5>
            <p className="mb-4">Sign up to our newsletters for updates and hot deals.</p>
            <form className="">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full px-4 py-2 text-gray-800 rounded mb-2 focus:outline-none" 
                required
              />
              <button 
                type="submit" 
                className="bg-itccolor hover:shadow-md text-white px-4 py-2 w-full rounded"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
        <div className="text-center pt-4 border-t border-gray-700">
          <p>&copy; 2024 Imo Transport Company Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
