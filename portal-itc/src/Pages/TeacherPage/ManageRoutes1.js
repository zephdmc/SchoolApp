import React, { useState, useEffect, useRef, useContext } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { getAllRoutes, getRouteProfile, deleteRoute, updateRouteProfile, AddRoute } from '../../services/SessionService';
import AuthContext from '../../context/AuthContext';

const ManageRoutes = () => {
  const [currentRoute, setCurrentRoute] = useState(null);
  const [isViewRouteModalOpen, setViewRouteModalOpen] = useState(false);
  const [isEditRouteModalOpen, setEditRouteModalOpen] = useState(false);
  const [isDeleteRouteModalOpen, setDeleteRouteModalOpen] = useState(false);
  const [activePopupId, setActivePopupId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddRouteModalOpen, setAddRouteModalOpen] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [error, setError] = useState(null);

  const popupRef = useRef();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const data = await getAllRoutes();
        setRoutes(data);
      } catch (error) {
        console.error('Failed to fetch Routes:', error);
      }
    };
    fetchRoutes();
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

  const handleUpdateRoute = async (updateData) => {
    try {
      await updateRouteProfile(updateData);
      setRoutes(routes.map(u => u._id === currentRoute._id ? { ...u, ...updateData } : u));
      setEditRouteModalOpen(false);
      alert('Route successfully updated!');
    } catch (error) {
      console.error('Failed to update Route:', error);
    }
  };

  const handleDeleteRoute = async (routeId) => {
    try {
      await deleteRoute(routeId);
      setRoutes(routes.filter((route) => route._id !== routeId)); // Update to use _id
      setDeleteRouteModalOpen(false);
      alert('Route successfully deleted!');
      const updatedRoutes = await getAllRoutes(); // Add await here
      setRoutes(updatedRoutes);
    } catch (error) {
      console.error('Failed to delete Route:', error);
    }
  };

  const filteredRoutes = routes.filter((route) =>
    route.routeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRoute = async (routeData) => {
    try {
      await AddRoute(routeData);
      const updatedRoutes = await getAllRoutes(); // Add await here
      setRoutes(updatedRoutes);
    } catch (err) {
      setError('Failed to register. Please try again.');
    }
    setAddRouteModalOpen(false);
    alert('Route successfully added!');
  };

  return (
    <div className="p-4 w-full">
      {/* Upper Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Routes</h1>
        <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-2">
          <div className="relative mb-4 sm:mb-0">
            <FaSearch className="absolute top-2.5 left-3 text-gray-400" />
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full sm:w-64"
              placeholder="Search Routes"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setAddRouteModalOpen(true)}
            className="flex items-center space-x-2 bg-itccolor text-white px-4 py-2 rounded-md"
          >
            <FaPlus />
            <span>Add Route</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto  h-[10rem] md:h-[30rem]">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gray-500">
            <tr>
              <th className="py-2 px-4 border-b">Start Location</th>
              <th className="py-2 px-4 border-b">End Location</th>
              <th className="py-2 px-4 border-b">Distance</th>
              <th className="py-2 px-4 border-b">Duration</th>
              <th className="py-2 px-4 border-b">Route Name</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoutes.map((route) => (
              <tr key={route._id}>
                <td className="py-2 px-4 border-b">{route.startLocation}</td>
                <td className="py-2 px-4 border-b">{route.endLocation}</td>
                <td className="py-2 px-4 border-b">{route.distance}</td>
                <td className="py-2 px-4 border-b">{route.duration}</td>
                <td className="py-2 px-4 border-b">{route.routeName}</td>
                <td className="py-2 px-4 border-b relative">
                  <button onClick={() => togglePopup(route._id)} className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h.01M12 12h.01M18 12h.01" />
                    </svg>
                  </button>
                  {activePopupId === route._id && (
                    <div ref={popupRef} className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                      <ul>
                        <li>
                          <button
                            onClick={() => {
                              setCurrentRoute(route);
                              setViewRouteModalOpen(true);
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
                              setCurrentRoute(route);
                              setEditRouteModalOpen(true);
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
                              setCurrentRoute(route);
                              setDeleteRouteModalOpen(true);
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

      {/* Add Route Modal */}
      {isAddRouteModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
          <div className='bg-itccolor '>
              <h3 className="text-lg font-medium leading-6 text-gray-100 p-6">Add User</h3>
              </div>            {error && <p className="text-red-500 text-sm">{error}</p>}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const routeData = {
                  startLocation: e.target.startLocation.value,
                  endLocation: e.target.endLocation.value,
                  distance: e.target.distance.value,
                  duration: e.target.duration.value,
                  routeName: e.target.routeName.value,
                };
                handleAddRoute(routeData);
              }}
            >
              <div className="px-6 mt-2">
                {/* Form Fields */}
                <div className="mb-4">
                  <label htmlFor="startLocation" className="block text-sm font-medium text-gray-700">Start Location</label>
                  <input type="text" name="startLocation" id="startLocation" className="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="endLocation" className="block text-sm font-medium text-gray-700">End Location</label>
                  <input type="text" name="endLocation" id="endLocation" className="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="distance" className="block text-sm font-medium text-gray-700">Distance (km)</label>
                  <input type="text" name="distance" id="distance" className="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (hours)</label>
                  <input type="text" name="duration" id="duration" className="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="routeName" className="block text-sm font-medium text-gray-700">Route Name</label>
                  <input type="text" name="routeName" id="routeName" className="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-4">
                <button type="button" onClick={() => setAddRouteModalOpen(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md">Cancel</button>
                <button type="submit" className="bg-itccolor hover:bg-itc-dark text-white font-medium py-2 px-4 rounded-md">Add Route</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Route Modal */}
      {isViewRouteModalOpen && currentRoute && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
            <h3 className="text-lg font-medium leading-6 text-gray-900 p-6">View Route</h3>
            <div className="px-6">
              <p><strong>Start Location:</strong> {currentRoute.startLocation}</p>
              <p><strong>End Location:</strong> {currentRoute.endLocation}</p>
              <p><strong>Distance:</strong> {currentRoute.distance}</p>
              <p><strong>Duration:</strong> {currentRoute.duration}</p>
              <p><strong>Route Name:</strong> {currentRoute.routeName}</p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-4">
              <button type="button" onClick={() => setViewRouteModalOpen(false)} className="bg-itccolor hover:bg-itc-dark text-white font-medium py-2 px-4 rounded-md">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Route Modal */}
      {isEditRouteModalOpen && currentRoute && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
          <div className='bg-itccolor '>
              <h3 className="text-lg font-medium leading-6 text-gray-100 p-6">Edit Route</h3>
              </div> 
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedRoute = {
                  ...currentRoute,
                  startLocation: e.target.startLocation.value,
                  endLocation: e.target.endLocation.value,
                  distance: e.target.distance.value,
                  duration: e.target.duration.value,
                  routeName: e.target.routeName.value,
                };
                handleUpdateRoute(updatedRoute);
              }}
            >
              <div className="px-6">
                <div className="mb-4">
                  <label htmlFor="startLocation" className="block text-sm font-medium text-gray-700">Start Location</label>
                  <input type="text" name="startLocation" id="startLocation" defaultValue={currentRoute.startLocation} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="endLocation" className="block text-sm font-medium text-gray-700">End Location</label>
                  <input type="text" name="endLocation" id="endLocation" defaultValue={currentRoute.endLocation} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="distance" className="block text-sm font-medium text-gray-700">Distance (km)</label>
                  <input type="text" name="distance" id="distance" defaultValue={currentRoute.distance} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (hours)</label>
                  <input type="text" name="duration" id="duration" defaultValue={currentRoute.duration} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="routeName" className="block text-sm font-medium text-gray-700">Route Name</label>
                  <input type="text" name="routeName" id="routeName" defaultValue={currentRoute.routeName} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-4">
                <button type="button" onClick={() => setEditRouteModalOpen(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md">Cancel</button>
                <button type="submit" className="bg-itccolor hover:bg-itc-dark text-white font-medium py-2 px-4 rounded-md">Update Route</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Route Modal */}
      {isDeleteRouteModalOpen && currentRoute && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
          <div className='bg-itccolor '>
              <h3 className="text-lg font-medium leading-6 text-gray-100 p-6">Delete User</h3>
              </div>             <p className="px-6">Are you sure you want to delete this route?</p>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-4">
              <button type="button" onClick={() => setDeleteRouteModalOpen(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md">Cancel</button>
              <button type="button" onClick={() => handleDeleteRoute(currentRoute._id)} className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md">Delete Route</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRoutes;
