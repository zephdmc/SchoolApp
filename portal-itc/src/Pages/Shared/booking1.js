
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';
// import {addBooking } from '../../services/ClassService';
import {FailedBooking} from './FaildBookings1';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// const TILL_BOOKING_API_URL = process.env.REACT_APP_BOOKING_API_URL;
const PAYMENT_TIME = process.env.REACT_APP_PAYMENT_KEY; // Updated to match the correct variable name



const SearchCars = () => {
 
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [date, setDate] = useState('');
  const [routes, setRoutes] = useState([]);
  const [filteredStartLocations, setFilteredStartLocations] = useState([]);
  const [filteredEndLocations, setFilteredEndLocations] = useState([]);
  const [availableCars, setAvailableCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null); // To track the selected car
  const [amount, setSelectedCarAmount] = useState(null); // To track the selected car
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [BookingComfirm, setBookingComfirm] = useState(false); // Modal visibility
    // const [showModalAvailableCar, setShowModalAvailableCar] = useState(false); // Modal visibility
    const [booking, setSelectedBooking] = useState(null); // To track the selected car
    const [Btx_ref, setTx_ref] = useState('');
    const [btransaction_id, settransaction_id] = useState('');
    const [bcreated_at, setcreated_at] = useState('');
    const [bcharged_amount, setcharged_amount] = useState('');
    const dialogRef = useRef(null);

  // Fetch routes data from the API
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        // const response = await axios.get(`${TILL_BOOKING_API_URL}/api/routes/`);
        const response = await axios.get(`/booking/api/routes/`);
        console.log('Routes fetched:', response.data);
        setRoutes(response.data);
      } catch (err) {
        console.log('erro loaa', err)
        setError('Error fetching routes');
      }
    };
    fetchRoutes();
  }, []);

  // Filter start locations based on input
  useEffect(() => {
    if (startLocation) {
      const filtered = routes.filter(route =>
        route.startLocation.toLowerCase().includes(startLocation.toLowerCase())
      );
      setFilteredStartLocations(filtered);
    } else {
      setFilteredStartLocations([]);
    }
  }, [startLocation, routes]);

  // Filter end locations based on input
  useEffect(() => {
    if (endLocation) {
      const filtered = routes.filter(route =>
        route.endLocation.toLowerCase().includes(endLocation.toLowerCase())
      );
      setFilteredEndLocations(filtered);
    } else {
      setFilteredEndLocations([]);
    }
  }, [endLocation, routes]);
    
    
  
    
    
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    // Check if start and end locations match any routes
    const startMatch = routes.some(route =>
      route.startLocation.toLowerCase() === startLocation.toLowerCase()
    );
    const endMatch = routes.some(route =>
      route.endLocation.toLowerCase() === endLocation.toLowerCase()
    );
  
    if (!startMatch || !endMatch) {
      setError('No matching routes found.');
      setAvailableCars([]);
      setLoading(false);
      return;
    }
    try {
      // Step 1: Fetch routes where start and end locations match
      const matchingRoutes = routes.filter(
        route => route.startLocation === startLocation && route.endLocation === endLocation
      );
  
      if (matchingRoutes.length === 0) {
        setError('No matching routes found.');
        setAvailableCars([]);
        return;
      }
  
      // Step 2: Fetch cars and filter by routeId and available date
      const routeIds = matchingRoutes.map(route => route._id);  // Assuming `_id` is the route ID
      // const carsResponse = await axios.get(`${TILL_BOOKING_API_URL}/api/cars/`);
      const carsResponse = await axios.get(`/booking/api/cars/`);

      console.log(carsResponse);
      const cars = carsResponse.data;
  
      // Log the date to make sure it's correct
      console.log("Selected Date:", date);
  
      if (!date) {
        setError('No date selected.');
        setLoading(false);
        return;
      }
  
      // Convert search date to ISO format 'YYYY-MM-DD' for comparison
      const searchDate = new Date(date);
  
      // Check if searchDate is valid
      if (isNaN(searchDate.getTime())) {
        setError('Invalid date selected.');
        setLoading(false);
        return;
      }
  
      const formattedSearchDate = searchDate.toISOString().split('T')[0];
  
      // Filter cars by routeId and compare the 'date' field as 'YYYY-MM-DD'
      const filteredCars = cars.filter(car => {
        const carDate = new Date(car.date);
  
        // Ensure the car date is valid before comparison
        if (!isNaN(carDate.getTime())) {
          const formattedCarDate = carDate.toISOString().split('T')[0];  // Extract date part
          return routeIds.includes(car.routeId) && formattedCarDate === formattedSearchDate;
        } else {
          console.error('Invalid car date:', car.date);
          return false;
        }
      });
  
      if (filteredCars.length === 0) {
        setError('No available cars found for the selected date.');
        setAvailableCars([]);
      } else {
        setAvailableCars(filteredCars);
      }
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError('An error occurred while searching for cars.');
    } finally {
      setLoading(false);
    }
  };
    

  console.log(selectedCar)
  
  const handleViewDetails = (car) => {
    setSelectedCar(car); // Set the selected car for displaying details
    setSelectedCarAmount(car.price)
    setShowModal(true); // Show modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close modal
  };
    

  const ViewBookedReciept = () => {
    setBookingComfirm(false)
    setSelectedCar(null); // Clear selected car
  }
const [formData, setFormData] = useState({
  passengerName: '',
  phone: '',
  alternatePhone: '',
  email: '',
  address: '',
  nextOfKin: '',
  nextOfKinPhone: '',
  nextOfKinAddress: ''
});

const Booked = {
  passengerName: formData.passengerName,
  phone: formData.phone,
  alternatePhone: formData.alternatePhone,
  email: formData.email,
  address: formData.address,
  nextOfKin: formData.nextOfKin,
  nextOfKinPhone: formData.nextOfKinPhone,
  nextOfKinAddress: formData.nextOfKinAddress,
  startLocation: startLocation,
  endLocation: endLocation,
  carNumber: selectedCar ? selectedCar.carNumber : '', // Use selectedCar correctly
  transaction_id: booking ? booking.transaction_id : '',
  status: 0,
  approver: null,

};


console.log(Booked, 'booked Details')


  
// const updateAvailableSeats = async (carId, newSeatCount) => {
//   try {
//     // Send a request to update the available seats for the car
//     const response = await axios.put(`${TILL_BOOKING_API_URL}/api/cars/${carId}/update-seats`, {
//       availableSeats: newSeatCount
//     });
    
//     console.log('Available seats updated:', response.data);
//   } catch (err) {
//     console.error('Error updating available seats:', err);
//     alert('Failed to update available seats.');
//   }
// };
  
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };



  const email = formData.email;
  const  phone_number = formData.phone;
 const  name = formData.passengerName;
 console.log(name);

 console.log(PAYMENT_TIME);

  const config = {
    public_key: PAYMENT_TIME,
    tx_ref: Date.now(),
    amount: amount,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email,
      phone_number,
      name,
    },

    customizations: {
      title: 'Imo Transport Company LTD',
      description: 'Payment for trasportation fee',
      logo: '/image/ITCLogoBrown.png',
    },
  };

  
  const updateAvailableSeats = async (carId, newSeatCount) => {
    try {
      // Send a request to update the available seats for the car
      // const response = await axios.put(`${TILL_BOOKING_API_URL}/api/cars/${carId}/update-seats`, {
        const response = await axios.put(`/booking/api/cars/${carId}/update-seats`, {
  
        availableSeats: newSeatCount
      });
  
      console.log('Available seats updated:', response.data);
    } catch (err) {
      console.error('Error updating available seats:', err);
      alert('Failed to update available seats.');
    }
  };

  
const checkSeatAvailability = async (carId) => {
  try {
    // Make an API call to check if the seat is still available
    // const response = await fetch(`${TILL_BOOKING_API_URL}/api/cars/${carId}/availability`);
    const response = await fetch(`/booking/api/cars/${carId}/availability`);
    const data = await response.json();

    // Check if seats are available
    return data.isAvailable; // Return true if available, false if unavailable
  } catch (error) {
    console.error("Error checking seat availability:", error);
    return false; // In case of error, assume the seat is unavailable
  }
  };
  
    // Function to download the dialog box as a PDF
    const downloadDialogAsPDF = () => {
      if (dialogRef.current) {
        html2canvas(dialogRef.current).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save('booking-confirmation.pdf');
        });
      }
    };

  
const saveFailedBooking = async (bookingDetails) => {
  try {
    await FailedBooking(bookingDetails);
    console.log('Failed booking saved to database.');
  } catch (error) {
    console.error('Error saving failed booking:', error);
  }
};

  
const fwConfig = {
  ...config,
  text: 'Proceed to pay',
  callback: async (response) => {
    console.log(response);

    if (response.status === 'successful') {
      try {
        const { tx_ref, transaction_id, charged_amount, created_at } = response;
        setTx_ref(tx_ref)
        settransaction_id(transaction_id)
        setcreated_at(created_at)
        setcharged_amount(charged_amount)
        if (!tx_ref || !transaction_id) {
          throw new Error('Payment details are missing.');
        }

        // Re-check seat availability after payment
        const isSeatAvailable = await checkSeatAvailability(selectedCar._id);
        if (!isSeatAvailable) {
          // Save failed booking to the database
          await saveFailedBooking({
            passengerName: formData.passengerName,
            phone: formData.phone,
            carId: selectedCar._id,
            tx_ref,
            transaction_id,
            charged_amount,
            created_at
          });

          // Notify user about the issue
          alert('The seat is no longer available. Please contact our support team.');

          return; // Exit the flow to prevent further booking processing
        }

        // Proceed to save booking and update seat count
        const updatedBooking = {
          ...Booked,
          tx_ref,
          transaction_id,
          charged_amount,
          created_at,
        };

        await addBooking(updatedBooking);

        const newSeatCount = selectedCar.availableSeats - 1;
        if (newSeatCount < 0) {
          throw new Error('No available seats left.');
        }

        await updateAvailableSeats(selectedCar._id, newSeatCount);
        closePaymentModal();
        setSelectedBooking(response);
        handleCloseModal()
        setBookingComfirm(true)
        alert('Payment successful! Booking saved.');
      } catch (err) {
        console.error('Error completing booking:', err);
        setError('Failed to complete booking. Please try again.');
        alert('Booking failed. Please try again.');
      }
    } else {
      alert('Payment failed. Please try again.');
    }
  },
  onClose: () => {
    setShowModal(false);
  },
  };
  


  return (
    <div className="max-w-3xl mx-auto mt-2">
      <form onSubmit={handleSearch} className="bg-white shadow-sm rounded-lg p-2">
        <h2 className="text-md font-semibold mb-2 text-center">Book a trip</h2>
        
        <div className=" flex">
          {/* Start Location Input */}
          <div className="relative mb-2 px-2 w-full">
            <input
              type="text"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              className="w-full border border-gray-300 text-md  h-10 rounded-lg p-3"
              placeholder="Enter start location"
              required
            />
            {filteredStartLocations.length > 0 && (
              <ul className="absolute bg-white border rounded-lg shadow-md w-full  h-[7rem] mt-1 z-50 max-h-40 overflow-auto">
                {filteredStartLocations.map((route, index) => (
                  <li
                    key={index}
                    className="p-2 cursor-pointer text-md  h-10 hover:bg-gray-100"
                    onClick={() => {
                      setStartLocation(route.startLocation);
                      setFilteredStartLocations([]); // Clear dropdown after selection
                    }}
                  >
                    {route.startLocation}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* End Location Input */}
          <div className="relative mb-2 px-2 w-full">
            <input
              type="text"
              value={endLocation}
              onChange={(e) => setEndLocation(e.target.value)}
              className="w-full border border-gray-300 text-md  h-10 rounded-lg p-3"
              placeholder="Enter end location"
              required
            />
            {filteredEndLocations.length > 0 && (
              <ul className="absolute bg-white border rounded-lg shadow-md w-full h-[7rem] mt-1 z-50 max-h-40 overflow-auto">
                {filteredEndLocations.map((route, index) => (
                  <li
                    key={index}
                    className="p-2 cursor-pointer text-md  h-10 hover:bg-gray-100"
                    onClick={() => {
                      setEndLocation(route.endLocation);
                      setFilteredEndLocations([]); // Clear dropdown after selection
                    }}
                  >
                    {route.endLocation}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Date Input */}
          <div className="mb-2 px-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300  h-10 text-md rounded-lg p-3"
              required
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-[40%] bg-itccolor text-white h-10 text-sm font-semibold  text-md rounded-lg hover:bg-orange-900 transition"
          >
            Search Bus
          </button>
        </div>
      </form>

      {/* Display Search Results */}
      {loading && <p>Loading available cars...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {availableCars.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mt-6">Available Cars</h2>
          <table className="min-w-full bg-white divide-y divide-gray-200 mt-4">
            <thead>
              <tr>
              <th className="px-4 py-2">o</th> {/* New Image Column */}
                <th className="px-4 py-2">Car Name</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Available Seats</th>
                <th className="px-4 py-2">Car Number</th>
              </tr>
            </thead>
            <tbody>
            {availableCars.map((car) => (
          <tr key={car._id}>
            <td className="px-4 py-2">
              {/* Display image based on carname */}
              {car.carname.toLowerCase() === 'sienna' && (
                <img src="/images/Sienna.png" alt="Siena" className="w-20 h-12 object-cover" />
              )}
              {car.carname.toLowerCase() === 'hiace' && (
                <img src="/images/Hiace.png" alt="Hiace" className="w-20 h-12 object-cover" />
              )}
              {car.carname.toLowerCase() === 'coach' && (
                <img src="/images/coach.jpg" alt="Coach" className="w-20 h-12 object-cover" />
              )}
            </td>
                  <td className="px-4 text-itccolor text-center py-2">{car.carname}</td>
                  <td className="px-4 text-itccolor  text-center py-2">#{car.price}</td>
                  <td className="px-4 text-itccolor  text-center py-2">{car.availableSeats}</td>
                <td className="px-4 text-itccolor  text-center py-2">{car.carNumber}</td>
                {/* <button
                      className="bg-itccolor hover:bg-orange-800 m-2 text-white px-4 py-2 rounded-lg"
                      onClick={() => handleViewDetails(car)}
                    >
                      View Details
                </button> */}
                



                <div>
                {car.availableSeats > 0 && new Date(car.date) >= new Date() ? (
    <button
      className="bg-itccolor hover:bg-orange-800 m-2 text-white px-4 py-2 rounded-lg"
      onClick={() => handleViewDetails(car)}
    >
      Book Now
    </button>
  ) : (
    <span className="text-red-500 m-4 px-4 py-2 font-bold">
      {new Date(car.date) < new Date() ? 'Expired' : 'Fully Booked'}
    </span>
  )}
</div>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}







      {/* booking dialogue  */}
      {BookingComfirm &&  selectedCar && (
            
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <div ref={dialogRef} className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
                           <div className='w-full bg-itccolor h-6  items-center justify-center'> <h2 className="text-2xl  bg-gray-50 font-bold mb-2">Payment Reciept</h2></div>
                            <p className="text-sm text-gray-500 mt-2 mb-4">Imo State Transport Company LTD</p>
                      
                      <div className="mb-4">
                        <p className="text-md font-semibold border-b-[2px]  mt-2 border-gray-500">Booking Details:</p>
                              <p className="text-gray-700 text-sm"><strong>Created: </strong>  {bcreated_at}</p>
                              <p className="text-gray-700 text-sm"><strong> Booking ID:  </strong>  {btransaction_id}</p>
                              <p className="text-gray-700 text-sm"><strong>BookingRef:  </strong>  {Btx_ref}</p>
            
                      </div>
            
                      <div className="mb-4  border-b-[2px]  mt-2 border-gray-500">
                        <p className="text-md font-semibold">Booked By:</p>
                              <p className="text-gray-700 text-sm"><i>Booked By: </i> {Booked.passengerName}</p>
                              <p className="text-gray-700 text-sm"><i>Phone: </i>  {Booked.phone}</p>
                              <p className="text-gray-700 text-sm"><i> Email: </i> {Booked.email}</p>
                                      </div>
            
                      <div className="mb-4  mt-2 border-b-[2px] border-gray-500">
                        <p className="text-md font-semibold">Description:</p>
                              <p className="text-gray-700 text-sm"><strong>Amount:</strong> {bcharged_amount}</p>
                              <p className="text-gray-700 text-sm"><strong>Date:</strong>  {selectedCar.time}</p>
                              <p className="text-gray-700 text-sm"><strong>Time:</strong>  {selectedCar.date}</p>
                              <p className="text-gray-700 text-sm"><strong>Seat No:</strong> {selectedCar.availableSeats}</p>
                              <p className="text-gray-700 text-sm"><strong>From:</strong>  {Booked.startLocation}</p>
                              <p className="text-gray-700 text-sm"><strong>To:</strong> {Booked.endLocation}</p>
            
                      </div>
            
                      <div className="mb-4">
                        <div className="text-lg font-semibold">Note:<p className='text-sm'>If you are eligible for a refund, it will be processed within 1 business days and issued to the original method of payment.</p></div>
                        <p className="text-gray-700"></p>
                      </div>
            
                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={downloadDialogAsPDF}
                          className="px-4 py-2 bg-itccolor text-white rounded hover:bg-gray-500"
                        >
                          Download PDF
                        </button>
                        <button
                          onClick={ViewBookedReciept}
                          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
            
            
            
            
            
            )}




            {/* Modal for Car Details and Traveler Form */}
            {showModal && selectedCar && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg w-full max-w-4xl shadow-lg overflow-y-auto">
      
      {/* First Div: Title and Close Button */}
      <div className="flex bg-itccolor justify-between items-center mb-6">
        <h3 className="text-3xl p-8 font-bold text-gray-50">Make Payment</h3>
        <button 
          type="button" 
          className="text-gray-50 p-6 hover:text-gray-700" 
          onClick={handleCloseModal}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Second Div: Car Details Section */}
      <div className="grid grid-cols-1 px-6 md:grid-cols-3 gap-6 mb-6">
        
        {/* Column 1: Car Image */}
        <div className="flex justify-center items-center">
          {selectedCar.carname.toLowerCase() === 'sienna' && (
            <img src="/images/Sienna.png" alt="Sienna" className="w-32 h-20 object-cover rounded-lg" />
          )}
          {selectedCar.carname.toLowerCase() === 'hiace' && (
            <img src="/images/Hiace.png" alt="Hiace" className="w-32 h-20 object-cover rounded-lg" />
          )}
          {selectedCar.carname.toLowerCase() === 'coach' && (
            <img src="/images/coach.jpg" alt="Coach" className="w-32 h-20 object-cover rounded-lg" />
          )}
        </div>

        {/* Column 2: Car Information */}
        <div className="space-y-4 text-center border-x-[1px] border-itccolor px-6 md:text-left">
          <p className="flex items-center text-itccolor justify-center md:justify-start">
            <svg className="w-5 h-5 mr-2 text-itccolor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
            <span className="font-semibold">Car Name: {selectedCar.carname}</span>
          </p>
          <p className="flex items-center justify-center md:justify-start">
            <svg className="w-5 h-5 mr-2 text-itccolor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 19l9 2-3-13-9-4-9 4 3 13 9-2z" />
            </svg>
            <span className="font-semibold text-itccolor">Car Number: {selectedCar.carNumber}</span>
          </p>
          <p className="flex items-center justify-center md:justify-start">
            <svg className="w-5 h-5 mr-2 text-itccolor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold text-itccolor">Time: {selectedCar.time}</span>
          </p>
          <p className="flex items-center justify-center md:justify-start">
            <svg className="w-5 h-5 mr-2 text-itccolor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M7 7h10M7 11h10M5 15h14" />
            </svg>
            <span className="font-semibold text-itccolor">Available Seats: {selectedCar.availableSeats}</span>
          </p>
          
          {/* Add Start and End Locations */}
        
        </div>

        {/* Column 3: Price Information */}
              <div className="justify-center md:justify-start items-center">
                <div className=''>
              <p className="flex items-center mt-4 justify-center md:justify-start">
              <svg className="w-5 h-5 mr-2 text-itccolor" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 10a3 3 0 110-6 3 3 0 010 6z" />
</svg>

            <span className="font-semibold text-itccolor">Start: {startLocation}</span>
          </p>
          <p className="flex items-center justify-center mb-4 md:justify-start">
          <svg className="w-5 h-5 mr-2 text-itccolor" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 10a3 3 0 110-6 3 3 0 010 6z" />
</svg>

            <span className="font-semibold text-itccolor">Destination: {endLocation}</span>
                  </p>
                  </div>
          <p className='text-gray-500 text-sm'>Ticket Price</p>
          <p className="text-6xl font-bold text-itccolor flex items-center">
            <span className="text-6xl mr-1">₦</span> {selectedCar.price}
          </p>
        </div>
      </div>

      {/* Third Div: Traveler Form Section */}
      <h4 className="text-xl font-semibold mb-4 px-6 text-gray-700">Traveler Information</h4>
      <div className="space-y-4 pb-6 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <input
    type="text"
    name="passengerName"
    placeholder="Passenger Name"
    className={`border p-3 rounded-lg w-full ${!formData.passengerName ? 'border-red-500' : ''}`}
    value={formData.passengerName}
    onChange={(e) => setFormData({ ...formData, passengerName: e.target.value })}
  />
  <input
    type="text"
    name="phone"
    placeholder="Phone"
    className={`border p-3 rounded-lg w-full ${!/^\d+$/.test(formData.phone) ? 'border-red-500' : ''}`}
    value={formData.phone}
    onChange={(e) => {
      if (/^\d*$/.test(e.target.value)) setFormData({ ...formData, phone: e.target.value });
    }}
  />
  <input
    type="email"
    name="email"
    placeholder="Email"
    className={`border p-3 rounded-lg w-full ${!/\S+@\S+\.\S+/.test(formData.email) ? 'border-red-500' : ''}`}
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
  />
  <input
    type="text"
    name="alternatePhone"
    placeholder="Alternate Phone"
    className={`border p-3 rounded-lg w-full ${!/^\d+$/.test(formData.alternatePhone) ? 'border-red-500' : ''}`}
    value={formData.alternatePhone}
    onChange={(e) => {
      if (/^\d*$/.test(e.target.value)) setFormData({ ...formData, alternatePhone: e.target.value });
    }}
  />
  <input
    type="text"
    name="address"
    placeholder="Address"
    className="border p-3 rounded-lg w-full"
    value={formData.address}
    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
  />
  <input
    type="text"
    name="nextOfKin"
    placeholder="Next of Kin"
    className={`border p-3 rounded-lg w-full ${!formData.nextOfKin ? 'border-red-500' : ''}`}
    value={formData.nextOfKin}
    onChange={(e) => setFormData({ ...formData, nextOfKin: e.target.value })}
  />
  <input
    type="text"
    name="nextOfKinPhone"
    placeholder="Next of Kin Phone"
    className={`border p-3 rounded-lg w-full ${!/^\d+$/.test(formData.nextOfKinPhone) ? 'border-red-500' : ''}`}
    value={formData.nextOfKinPhone}
    onChange={(e) => {
      if (/^\d*$/.test(e.target.value)) setFormData({ ...formData, nextOfKinPhone: e.target.value });
    }}
  />
  <input
    type="text"
    name="nextOfKinAddress"
    placeholder="Next of Kin Address"
    className="border p-3 rounded-lg w-full"
    value={formData.nextOfKinAddress}
    onChange={(e) => setFormData({ ...formData, nextOfKinAddress: e.target.value })}
  />
</div>

{/* Payment Button */}
<div className="p-6">
  {formData.passengerName &&
  formData.phone && /^\d+$/.test(formData.phone) &&
  formData.email && /\S+@\S+\.\S+/.test(formData.email) &&
  formData.alternatePhone && /^\d+$/.test(formData.alternatePhone) &&
  formData.address &&
  formData.nextOfKin &&
  formData.nextOfKinPhone && /^\d+$/.test(formData.nextOfKinPhone) &&
  formData.nextOfKinAddress ? (
    <FlutterWaveButton
      {...fwConfig}
      className="w-full bg-itccolor text-white px-4 py-2 rounded-lg"
      onClick={(e) => {
        e.preventDefault();
        // Proceed with FlutterWave payment
        console.log('All fields valid. Proceeding with payment.');
        // Call the payment function here
      }}
    />
  ) : (
    <button className="w-full bg-gray-400 text-white px-4 py-2 rounded-lg" disabled>
      Please fill in all fields
    </button>
  )}
</div>


      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default SearchCars;

