

import React, { useState, useEffect, useRef, useContext } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { getAllCars, deleteCar, updateCarProfile, addCar, getAllCarsByRegistered } from '../../services/carService';
import { getAllRoutes } from '../../services/SessionService';
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
// import { PiCurrencyNgn } from "react-icons/pi";
// import { FaCircleArrowRight } from "react-icons/fa6"; 

const ManageCars = () => {
  const [cars, setCars] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [currentCar, setCurrentCar] = useState(null);
  const [isViewCarModalOpen, setViewCarModalOpen] = useState(false);
  const [isEditCarModalOpen, setEditCarModalOpen] = useState(false);
  const [isDeleteCarModalOpen, setDeleteCarModalOpen] = useState(false);
  const [activePopupId, setActivePopupId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddCarModalOpen, setAddCarModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const popupRef = useRef();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();




  useEffect(() => {
    const fetchCarsAndRoutes = async () => {
      try {
        if (user) {
          // User is authenticated, so navigate them
          const carsData = await getAllCarsByRegistered(user._id);
          console.log(carsData)
          setCars(carsData);
          const routesData = await getAllRoutes();
          setRoutes(routesData);
        } else {
          // Fetch data when user is not authenticated
        
          navigate('/admin');
        }
        
        
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
   
      fetchCarsAndRoutes();
    }, [user]);  // or []
    

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

  const togglePopup = (carId) => {
    setActivePopupId((prev) => (prev === carId ? null : carId));
  };

  const registeredBy = user._id;
  console.log(registeredBy)


  const handleUpdateCar = async (updateData) => {
    const completeCarDataupdate = { ...updateData, registeredBy }; // ensure carData is an object
    console.log(completeCarDataupdate);
    try {
      await updateCarProfile(currentCar._id, completeCarDataupdate);
      setCars(cars.map((car) => (car._id === currentCar._id ? { ...car, ...updateData } : car)));
      setEditCarModalOpen(false);
      alert('Car successfully updated!');
    } catch (error) {
      console.error('Failed to update car:', error);
      setError('Failed to update car. Please try again.');
    }
  };

  const handleDeleteCar = async (carId) => {
    try {
      await deleteCar(carId);
      setCars(cars.filter((car) => car._id !== carId));
      setDeleteCarModalOpen(false);
      alert('Car successfully deleted!');
    } catch (error) {
      console.error('Failed to delete car:', error);
      setError('Failed to delete car. Please try again.');
    }
  };

  const filteredCars = cars.filter((car) =>
    car.carname.toLowerCase().includes(searchTerm.toLowerCase())
  );
 


  const handleAddCar = async (carData) => {
    if (typeof carData !== 'object') {
      console.error('Invalid carData format:', carData);
      setError('Invalid car data. Please try again.');
      return;
    }
  
    const completeCarData = { ...carData, registeredBy }; // ensure carData is an object
    console.log(completeCarData);
  
    try {
      await addCar(completeCarData);
      const updatedCars = await getAllCarsByRegistered(user._id);
      setCars(updatedCars);
      setAddCarModalOpen(false);
      alert('Car successfully added!');
    } catch (err) {
      console.error('Failed to add car:', err);
      setError('Failed to add car. Please try again.');
    }
  };
  
// Helper function to map car names to image filenames
const getCarImage = (carname) => {
  const carImages = {
    sienna: 'Sienna.png',  // Map 'sienna' to 'Siana.jpg'
    hiace: 'Hiace.png',   // Map 'hiace' to 'Hiace.jpg'
    // Add more car names and their corresponding images here
  };

  return carImages[carname.toLowerCase()] || 'default-image.jpg'; // Fallback to 'default-image' if carname not found
};

  return (
    <div className="p-4">
      {/* Upper Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Car Overview</h1>
        <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-2">
          <div className="relative mb-4 sm:mb-0">
            <FaSearch className="absolute top-2.5 left-3 text-gray-400" />
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full sm:w-64"
              placeholder="Search Cars"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setAddCarModalOpen(true)}
            className="flex items-center space-x-2 bg-itccolor text-white px-4 py-2 rounded-md"
          >
            <FaPlus />
            <span>Add Car</span>
          </button>
        </div>
      </div>

     {/* Car Table */}
      <div className="h-[50rem] overflow-x-auto">
        <table className="min-w-full bg-white divide-y divide-gray-200">
    <thead className="bg-gray-300">
      <tr className="text-sm">
        <th className="py-2  border-b">Car Name</th>
        <th className="py-2  border-b">Car Number</th>
        <th className="py-2  border-b">Available Seats</th>
        <th className="py-2 px-4 border-b">Price</th>
        <th className="py-2 px-4 border-b">Driver</th>
        <th className="py-2 px-4 border-b">Currently</th> {/* New column for Active/Inactive */}
        <th className="py-2 px-4 border-b">Actions</th>
      </tr>
    </thead>
    <tbody>
      {filteredCars.map((car) => {
        // Calculate the status for each car
        const carDate = new Date(car.date);
        const currentDate = new Date();
        const isActive = carDate > currentDate; // true if car date is in the future

        return (
          <tr key={car._id}>
            <td className="py-2 px-4 border-b">{car.carname}</td>
            <td className="py-2 px-4 border-b">{car.carNumber}</td>
            <td className="py-2 px-4 border-b">{car.availableSeats}</td>
            <td className="py-2 px-4 border-b">{car.price}</td>
            <td className="py-2 px-4 border-b">{car.time}</td>
            {/* <td className="py-2 px-4 border-b">
              {routes.find((route) => route._id === car.routeId)?.routeName || 'N/A'}
            </td> */}

            {/* Display Active/Inactive based on the date comparison */}
            <td className="py-2 px-4 border-b">
              {isActive ? (
                <span className="text-green-600 font-bold">Active</span>
              ) : (
                <span className="text-red-600 font-bold">Inactive</span>
              )}
            </td>

            <td className="py-2 px-4 border-b relative">
              <button onClick={() => togglePopup(car._id)} className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 12h.01M12 12h.01M18 12h.01"
                  />
                </svg>
              </button>
              {activePopupId === car._id && (
                <div
                  ref={popupRef}
                  className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg"
                >
                  <ul>
                    <li>
                      <button
                        onClick={() => {
                          setCurrentCar(car);
                          setViewCarModalOpen(true);
                          setActivePopupId(null);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        View
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setCurrentCar(car);
                          setEditCarModalOpen(true);
                          setActivePopupId(null);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Edit
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setCurrentCar(car);
                          setDeleteCarModalOpen(true);
                          setActivePopupId(null);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>

 
      

      {/* Add Car Modal */}
      {isAddCarModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          {/* Add Car Form */}
          <div className="bg-white p-6 rounded-lg shadow-lg mx-2 w-auto md:w-1/3">
          <div className='bg-itccolor p-4 mb-2 '>
              <h2 className="text-xl font-bold text-white rounded mb-2">ADD CAR</h2>
              </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <form
      onSubmit={(e) => {
        e.preventDefault();
        const carData = {
          carname: e.target.carname.value,
          carNumber: e.target.carNumber.value,
          availableSeats: parseInt(e.target.availableSeats.value, 10),
          driver: e.target.driver.value,
          price: parseFloat(e.target.price.value),
          time: e.target.time.value,
          date: e.target.date.value,
          routeId: e.target.route.value,
        };
        handleAddCar(carData);
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">Car Name</label>
        <select
          name="carname"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        >
          <option value="" disabled>Select an option</option>
          <option value="Sienna">Sienna</option>
          <option value="Hiace">Hiace</option>
          <option value="Coach">Coach</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Car Number</label>
        <input
          type="text"
          name="carNumber"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Available Seats</label>
        <input
          type="number"
          name="availableSeats"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
          min="1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          name="price"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
          min="0"
          step="0.01"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          name="date"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Bus Time</label>
        <input
          type="time"
          name="time"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Driver</label>
        <input
          type="text"
          name="driver"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Route</label>
        <select
          name="route"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        >
          <option value="" disabled>Select Route</option>
          {routes.map((route) => (
            <option key={route._id} value={route._id}>
              {route.routeName}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => setAddCarModalOpen(false)}
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          Cancel
        </button>
        <button type="submit" className="bg-itccolor text-white px-4 py-2 rounded-md">
          Add Car
        </button>
      </div>
    </form>
          </div>
        </div>
      )}

{isViewCarModalOpen && currentCar && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      {/* Display the car image based on the car name */}
      <img
        src={`/images/${getCarImage(currentCar.carname)}`}
        alt={currentCar.carname}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <h2 className="text-2xl bg-itccolor p-4 text-white font-semibold mb-4 text-center">{currentCar.carname}</h2>
      <div className="space-y-2">
        <p>
          <strong>Car Number:</strong> {currentCar.carNumber}
        </p>
        <p>
          <strong>Available Seats:</strong> {currentCar.availableSeats}
        </p>
        <p>
          <strong>Price:</strong> #{currentCar.price.toFixed(2)}
        </p>
        <p>
  <strong>Bus Time:</strong> {new Date(currentCar.date).toLocaleDateString()}
</p>

        <p>
          <strong>Bus Time:</strong> {currentCar.time}
        </p>
        <p>
          <strong>Driver:</strong> {currentCar.driver}
        </p>
        <p>
          <strong>Route:</strong>{' '}
          {routes.find((route) => route._id === currentCar.routeId)?.routeName || 'N/A'}
        </p>
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={() => setViewCarModalOpen(false)}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


     {/* Edit Car Modal */}
{isEditCarModalOpen && currentCar && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-auto mx-4 md:w-1/3">
            <div className='bg-itccolor p-4 mb-2 '>
              <h2 className="text-xl font-bold text-white rounded mb-2">EDIT CAR</h2>
              </div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const carname = e.target.carname.value.trim();
          const carNumber = e.target.carNumber.value.trim();
          const availableSeats = parseInt(e.target.availableSeats.value, 10);
          const price = parseFloat(e.target.price.value);
          const driver = e.target.driver.value.trim();
          const date = e.target.date.value;
          const time = e.target.bustime.value.trim();
          const routeId = e.target.route.value;

          // Error checking
          if (!carname) {
            setError("Please enter a value for Car Name.");
            return;
          }
          if (!carNumber) {
            setError("Please enter a value for Car Number.");
            return;
          }
          if (isNaN(availableSeats) || availableSeats <= 0) {
            setError("Available Seats must be a positive number.");
            return;
          }
          if (isNaN(price) || price < 0) {
            setError("Price must be a non-negative number.");
            return;
          }
          if (!date) {
            setError("Please select a Date.");
            return;
          }
          if (!time) {
            setError("Please enter a value for Bus Time.");
            return;
          }
          if (!driver) {
            setError("Please enter a value for Driver.");
            return;
          }
          if (!routeId) {
            setError("Please select a Route.");
            return;
          }

          // Clear error if all validations pass
          setError(null);

          const updatedCarData = {
            carname,
            carNumber,
            availableSeats,
            price,
            driver,
            date,
            time,
            routeId,
          };
          handleUpdateCar(updatedCarData);
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">Car Name</label>
          <select
            name="carname"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          >
            <option defaultValue={currentCar.carname} disabled>Select an option</option>
            <option value="Sienna">Sienna</option>
            <option value="Hiace">Hiace</option>
            <option value="Coach">Coach</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Car Number</label>
          <input
            type="text"
            name="carNumber"
            defaultValue={currentCar.carNumber}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Available Seats</label>
          <input
            type="number"
            name="availableSeats"
            defaultValue={currentCar.availableSeats}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
            min="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            defaultValue={currentCar.price}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            defaultValue={currentCar.bustime}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
            placeholder="e.g., 08:00 AM"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Bus Time</label>
          <input
            type="text"
            name="bustime"
            defaultValue={currentCar.bustime}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
            placeholder="e.g., 08:00 AM"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Driver</label>
          <input
            type="text"
            name="driver"
            defaultValue={currentCar.driver}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Route</label>
          <select
            name="route"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            defaultValue={currentCar.routeId}
            required
          >
            <option value="">Select Route</option>
            {routes.map((route) => (
              <option key={route._id} value={route._id}>
                {route.routeName}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setEditCarModalOpen(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button type="submit" className="bg-itccolor text-white px-4 py-2 rounded-md">
            Update Car
          </button>
        </div>
      </form>
    </div>
  </div>
)}


      {/* Delete Car Modal */}
      {isDeleteCarModalOpen && currentCar && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl mb-4">Delete Car</h2>
            <p>Are you sure you want to delete <strong>{currentCar.carname}</strong>?</p>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setDeleteCarModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCar(currentCar._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCars;
