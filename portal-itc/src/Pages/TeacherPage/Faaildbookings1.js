import React, { useState, useEffect, useRef, useContext } from 'react';
import { FaSearch } from 'react-icons/fa';
import { getAllFailedBookings } from '../../services/failedBooking';
import AuthContext from '../../context/AuthContext';

const FailedBookings = () => {
  const [failedBooking, setFailedBooking] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activePopupId, setActivePopupId] = useState(null);

  const popupRef = useRef();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getAllFailedBookings();
        // Filter only the failed bookings (assuming status 'failed' exists)
        // const failed = data.filter((booking) => booking.status === 'failed');
        setFailedBooking(data);
      } catch (error) {
        console.error('Failed to fetch failed bookings:', error);
      }
    };
    fetchBookings();
  }, [user.token]);

  // Handle popup close on outside click
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

  // Filter failed bookings by passenger name
  const filteredFailedBookings = failedBooking.filter((booking) =>
    booking.passengerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      {/* Failed Bookings Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Failed Booking List</h1>
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

      <div className="overflow-x-auto h-[10rem] md:h-[30rem]">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-red-500">
            <tr>
              <th className="py-2 px-4 border-b">Passenger Name</th>
              <th className="py-2 px-4 border-b">Phone</th>
                          <th className="py-2 px-4 border-b">Transaction Id</th>
                          <th className="py-2 px-4 border-b">created At</th>
              <th className="py-2 px-4 border-b">Tx_ref Id</th>
              <th className="py-2 px-4 border-b">Amount</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredFailedBookings.map((booking) => (
              <tr key={booking._id}>
                <td className="py-2 px-4 border-b">{booking.passengerName}</td>
                <td className="py-2 px-4 border-b">{booking.phone}</td>
                <td className="py-2 px-4 border-b">{booking.transaction_id}</td>
                <td className="py-2 px-4 border-b">{new Date(booking.created_at).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                <td className="py-2 px-4 border-b">{booking.tx_ref}</td>
                <td className="py-2 px-4 border-b">{booking.charged_amount}</td>
                <td className="py-2 px-4 border-b relative">
                  <button onClick={() => setActivePopupId(booking._id)} className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h.01M12 12h.01M18 12h.01" />
                    </svg>
                  </button>
                  {activePopupId === booking._id && (
                    <div ref={popupRef} className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                      <ul>
                        <li>
                          <button
                            onClick={() => setActivePopupId(null)}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            Dismiss
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
    </div>
  );
};

export default FailedBookings;
