
import React, { useState, useEffect } from 'react';
import TopNav from './Topvabae'; // Assuming TopNav is in the same directory

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <>
      <TopNav />
      <nav className={`fixed ${isVisible ? 'top-8' : 'top-2'} ${isVisible ? 'shadow-md' : 'shadow-[1px]'} left-0 w-full ${isVisible ? 'md:top-1 lg:top-8 top-[1px] bg-white' : 'bg-current'} text-itccolor z-30 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="mx-auto flex md:justify-start justify-between items-center md:px-[3%] lg:px-[10%] p-2">
          <div className="text-2xl ml-2 md:ml-[4%] flex lg:ml-[2%] text-left font-bold">
            <img src="images/ITCLogoBrown.png" alt="ITCLogo" className="h-20 w-20" />
            <p className="md:text-md lg:text-md my-4 pr-12 text-itccolor md:block hidden">Mercy Girl's High School Okigwe</p>
          </div>
          <div className="block lg:hidden">
            <button onClick={toggleMenu} className="text-itccolor focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
          {/* <div className={`lg:flex lg:items-center text-sm md:text-md lg:w-auto transition-all duration-500 ease-in-out transform ${isOpen ? 'block slide-in' : 'hidden slide-out'}`}>
            <a href="/Home" className="block my-2 text-itccolor font-bold lg:inline-block hover:border-b-2 border-itccolor lg:mt-0 mx-2 py-2 hover:text-gray-400">Home</a>
            <a href="/Terminals" className="block my-2 text-itccolor font-bold lg:inline-block hover:border-b-2 border-itccolor lg:mt-0 mx-2 py-2 hover:text-gray-400">Terminal</a>
            <a href="/Pricing" className="block my-2 text-itccolor font-bold lg:inline-block hover:border-b-2 border-itccolor lg:mt-0 mx-2 py-2 hover:text-gray-400">Pricing</a>
            <a href="/About" className="block my-2 text-itccolor font-bold lg:inline-block lg:mt-0 mx-2 hover:border-b-2 border-itccolor py-2 hover:text-gray-400">About</a>
            <a href="/Contact" className="block my-2 text-itccolor font-bold lg:inline-block hover:border-b-2 border-itccolor lg:mt-0 mx-2 py-2 hover:text-gray-400">Contact</a>
            <a href="/Bookings" className="block my-2 text-itccolor font-bold lg:inline-block hover:border-b-2 border-itccolor lg:mt-0 mx-2 py-2 hover:text-gray-400">Bookings</a>
          </div> */}
          <a href="/" className="bg-itccolor rounded-md hover:bg-gray-400 px-2 py-[2px] md:px-4 md:py-2 text-sm md:text-md ml-[1px] md:ml-0 text-white">Home</a>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

