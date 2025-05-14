import React, { useState } from 'react';
const Navbar = () => {
const [menuOpen, setMenuOpen] = useState(false);
const toggleMenu = () => {
setMenuOpen(!menuOpen);
};
return ( <nav className="bg-gray-800 p-4">
<div className="flex items-center justify-between">
{/* Logo or Brand */} <div className="text-white font-bold">Your Logo</div>
{/* Mobile Menu Button */} <button
className="lg:hidden text-white focus:outline-none" onClick={toggleMenu} >
<svg
className="h-6 w-6"
fill="none" stroke="currentColor" viewBox="0 0 24 24"
xmlns="http://www.w3.org/2000/svg" >
<path
strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" ></path>
</svg>
</button>
{/* Desktop Menu */} <div className="hidden lg:flex space-x-4">
<a href="#" className="text-white hover:bg-gray-600 px-3 py-2 rounded"> Home
</a>
<a href="#" className="text-white hover:bg-gray-600 px-3 py-2 rounded"> About </a>
{/* Add more menu items as needed */} </div>
</div>
{/* Off-canvas Menu */}
{menuOpen && (
<div className="lg:hidden absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-90">
<div className="flex justify-end p-4">
<button
className="text-white focus:outline-none" onClick={toggleMenu} >
<svg
className="h-6 w-6"
fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" >
<path
strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" ></path>
</svg>
</button>
</div>
<div className="flex flex-col items-center">
<a
href="#" className="text-white hover:bg-gray-600 px-4 py-2 rounded" >Home
</a>
<a
href="#" className="text-white hover:bg-gray-600 px-4 py-2 rounded" >About </a>
{/* Add more menu items as needed */} </div>
</div>
)} </nav>
);
};
export default Navbar;