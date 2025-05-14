import React, { useState, useEffect, useRef, useContext } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { getAllCars, deleteCar, updateCarProfile, addCar } from '../../services/carService';
import { getAllRoutes } from '../../services/routeService';
import AuthContext from '../../context/AuthContext';


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

  useEffect(() => {
    const fetchCarsAndRoutes = async () => {
      try {
        const carsData = await getAllCars();
        console.log(carsData)
        setCars(carsData);
        const routesData = await getAllRoutes();
        console.log(routesData)
        setRoutes(routesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchCarsAndRoutes();
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

  const togglePopup = (carId) => {
    setActivePopupId((prev) => (prev === carId ? null : carId));
  };



  const handleUpdateCar = async (updateData) => {
    try {
      await updateCarProfile(currentCar._id, updateData);
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
    try {
      await addCar(carData);
      const updatedCars = await getAllCars();
      setCars(updatedCars);
      setAddCarModalOpen(false);
      alert('Car successfully added!');
    } catch (err) {
      console.error('Failed to add car:', err);
      setError('Failed to add car. Please try again.');
    }
  };


  return (
    <div className="p-4 w-full">
      {/* Upper Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Cars</h1>
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
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gray-500">
            <tr className="text-sm">
              <th className="py-2 px-4 border-b">Car Name</th>
              <th className="py-2 px-4 border-b">Car Number</th>
              <th className="py-2 px-4 border-b">Available Seats</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Bus Time</th>
              <th className="py-2 px-4 border-b">Driver</th>
              <th className="py-2 px-4 border-b">Route</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody className='h-auto'>
            {filteredCars.map((car) => (
              <tr key={car._id}>
                <td className="py-2 px-4 border-b">{car.carname}</td>
                <td className="py-2 px-4 border-b">{car.carNumber}</td>
                <td className="py-2 px-4 border-b">{car.availableSeats}</td>
                <td className="py-2 px-4 border-b">{car.price}</td>
                <td className="py-2 px-4 border-b">{car.bustime}</td>
                <td className="py-2 px-4 border-b">{car.driver}</td>
                <td className="py-2 px-4 border-b">
                  {routes.find((route) => route._id === car.routeId)?.routeName || 'N/A'}
                </td>
                <td className="py-2 px-4 border-b relative">
                  <button onClick={() => togglePopup(car._id)} className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h.01M12 12h.01M18 12h.01" />
                    </svg>
                  </button>
                  {activePopupId === car._id && (
                    <div ref={popupRef} className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Car Modal */}
      {isAddCarModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          {/* Add Car Form */}
          <div className="bg-white  rounded-lg shadow-lg w-1/3">
          <div className='bg-itccolor '>
              <h3 className="text-lg font-medium leading-6 text-gray-100 p-6">Add Car</h3>
            </div>
            <div className='p-6'>
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
        </div>
      )}

      {/* View Car Modal */}
      {isViewCarModalOpen && currentCar && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
          <div className='bg-itccolor '>
              <h3 className="text-lg font-medium leading-6 text-gray-100 p-6">Car Details</h3>
              </div>
            <div className="space-y-2">
              <p>
                <strong>Car Name:</strong> {currentCar.carname}
              </p>
              <p>
                <strong>Car Number:</strong> {currentCar.carNumber}
              </p>
              <p>
                <strong>Available Seats:</strong> {currentCar.availableSeats}
              </p>
              <p>
                <strong>Price:</strong> ${currentCar.price.toFixed(2)}
              </p>
              <p>
                <strong>Bus Date:</strong> {currentCar.date}
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
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
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
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl mb-4">Edit Car</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedCarData = {
                  carname: e.target.name.value,
                  carNumber: e.target.carNumber.value,
                  availableSeats: parseInt(e.target.availableSeats.value, 10),
                  price: parseFloat(e.target.price.value),
                  driver: e.target.driver.value,
                  date: e.target.date.value,
                  time: e.target.time.value,
                  routeId: e.target.route.value, // Added route
                };
                handleUpdateCar(updatedCarData);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">Car Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={currentCar.carname}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
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
          <div className='bg-itccolor '>
              <h3 className="text-lg font-medium leading-6 text-gray-100 p-6">Delete Car</h3>
              </div>
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
