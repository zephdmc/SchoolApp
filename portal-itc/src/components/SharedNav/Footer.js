import React from 'react';
const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-500 py-8">
        <div className="text-center pt-4 border-t border-gray-700">
        <div className="flex justify-center mb-4">
            <img src="images/AcanetLogo.png" alt="Logo" className="h-16 md:h-24" />
        </div>
        <p className="text-sm"> <i>Powered by</i></p>
        <p className="text-sm text-bold">Zephtech Digital</p>
          <p className="text-sm font-bold bold">&copy; 2025 Zephtech. All Rights Reserved.</p>
        </div>
    </footer>
  );
};
export default Footer;