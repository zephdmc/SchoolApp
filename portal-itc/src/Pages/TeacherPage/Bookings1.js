import React, { useState, useEffect, useRef, useContext } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { getAllBooking} from '../../services/bookingService';
import AuthContext from '../../context/AuthContext';

const Bookings = () => {
  const [currentBooking, setCurrentBooking] = useState(null);
  const [isViewRouteModalOpen, setViewRouteModalOpen] = useState(false);
  const [activePopupId, setActivePopupId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [booking, setBookings] = useState([]);

  const popupRef = useRef();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getAllBooking();
          setBookings(data);
      } catch (error) {
        console.error('Failed to fetch Routes:', error);
      }
    };
    fetchBookings();
  }, [user.token]);

    
    
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setActivePopupId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const togglePopup = (routeId) => {
    setActivePopupId((prev) => (prev === routeId ? null : routeId));
  };




  const filteredRoutes = booking.filter((bookings) =>
  bookings.passengerName.toLowerCase().includes(searchTerm.toLowerCase())
  );



  return (
    <div className="p-4">
      {/* Upper Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Booking List</h1>
        <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-2">
          <div className="relative mb-4 sm:mb-0">
            <FaSearch className="absolute top-2.5 left-3 text-gray-400" />
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full sm:w-64"
              placeholder="Search Passenger's name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        
        </div>
      </div>

      <div className="overflow-x-auto  h-[10rem] md:h-[30rem]">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gray-500">
            <tr>
              <th className="py-2 px-4 border-b">Passenger Name</th>
              <th className="py-2 px-4 border-b">Phone</th>
              <th className="py-2 px-4 border-b">Next Of Kin Phone</th>
              <th className="py-2 px-4 border-b">Transaction Id</th>
                          <th className="py-2 px-4 border-b">Tx_ref Id</th>
                          <th className="py-2 px-4 border-b">Amount</th>
                          <th className="py-2 px-4 border-b">Action</th>

            </tr>
          </thead>
          <tbody>
            {filteredRoutes.map((booking) => (
              <tr key={booking._id}>
                <td className="py-2 px-4 border-b">{booking.passengerName
}</td>
                <td className="py-2 px-4 border-b">{booking.phone}</td>
                <td className="py-2 px-4 border-b">{booking.nextOfKinPhone}</td>
                <td className="py-2 px-4 border-b">
  {/* Format the created_at date */}
  {new Date(booking.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })}
</td>                    <td className="py-2 px-4 border-b">{booking.tx_ref}</td>
                    <td className="py-2 px-4 border-b">{booking.charged_amount}</td>

                    
                <td className="py-2 px-4 border-b relative">
                  <button onClick={() => togglePopup(booking._id)} className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h.01M12 12h.01M18 12h.01" />
                    </svg>
                  </button>
                  {activePopupId === booking._id && (
                    <div ref={popupRef} className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                      <ul>
                        <li>
                          <button
                            onClick={() => {
                              setCurrentBooking(booking);
                              setViewRouteModalOpen(true);
                              setActivePopupId(null);
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            View
                          </button>
                        </li>
                       
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

     

      {/* View Route Modal */}
      {isViewRouteModalOpen && currentBooking && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
            <h3 className="text-lg font-medium leading-6 text-gray-900 p-6">View Route</h3>
            <div className="px-6">
              <p><strong>Start Location:</strong> {currentBooking.startLocation}</p>
              <p><strong>End Location:</strong> {currentBooking.endLocation}</p>
              <p><strong>Distance:</strong> {currentBooking.distance}</p>
              <p><strong>Duration:</strong> {currentBooking.duration}</p>
              <p><strong>Route Name:</strong> {currentBooking.routeName}</p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-4">
              <button type="button" onClick={() => setViewRouteModalOpen(false)} className="bg-itccolor hover:bg-itc-dark text-white font-medium py-2 px-4 rounded-md">Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Bookings;
