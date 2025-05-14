
import React, { useState, useEffect, useContext, useRef  } from 'react';
import { fetchAllOrders } from '../../services/logisticsService';
import { getAllUsers } from '../../services/userService';
import Chart from 'chart.js/auto'; // Import a chart library for the graph
import AuthContext from '../../context/AuthContext';
import { getMonthlyLogistics, getYearlyLogistics, getTopLocation,  fetchRoutes, addRoute, updateRoute, deleteRoute, addGoodsWorthDetail, addSizeDetail, DeleteSize, DeleteGoodsWorth  } from '../../services/logisticsService';
import { FiTrash2, FiEdit } from "react-icons/fi";
import { AiOutlinePlus, AiOutlineEye } from "react-icons/ai";
import { IoMdAddCircle } from "react-icons/io";

const SAdminLogistics = () => {
    const { user } = useContext(AuthContext);
    const chartRef = useRef(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterDate, setFilterDate] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null); // For modal details view
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const [monthlyLogistics, setMonthlyLogistics] = useState(0);
    const [yearlyLogistics, setYearlyLogistics] = useState(0);
    const [topLocation, setTopLocation] = useState('');
    
  // Fetch all orders and users
  useEffect(() => {
    const loadData = async () => {
      const fetchedOrders = await fetchAllOrders();
      const fetchedUsers = await getAllUsers(user.token); // Fetch user data for matching user names
      setOrders(fetchedOrders);
      setUsers(fetchedUsers);
    };

    loadData();
  }, []);

  useEffect(() => {
    // Fetch summary metrics data
    const fetchMetrics = async () => {
      const monthlyData = await getMonthlyLogistics();
      const yearlyData = await getYearlyLogistics();
      const locationData = await getTopLocation();
      
      setMonthlyLogistics(monthlyData);
      setYearlyLogistics(yearlyData);
      setTopLocation(locationData);
    };

    fetchMetrics();
  }, []);
    
     // Process orders data to get monthly order count or total revenue
  const getMonthlyData = () => {
    const monthlyData = {};
    orders.forEach((order) => {
      const month = new Date(order.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!monthlyData[month]) {
        monthlyData[month] = { count: 0, revenue: 0 };
      }
      monthlyData[month].count += 1;
      monthlyData[month].revenue += order.amount;
    });
    return Object.entries(monthlyData).map(([month, { count, revenue }]) => ({ month, count, revenue }));
  };

  useEffect(() => {
    if (chartRef.current) {
      const monthlyData = getMonthlyData();
      const labels = monthlyData.map((data) => data.month);
      const countData = monthlyData.map((data) => data.count);
      const revenueData = monthlyData.map((data) => data.revenue);

      const chart = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Number of Orders',
              data: countData,
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              fill: true,
            },
            {
              label: 'Total Revenue',
              data: revenueData,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Value' },
            },
          },
        },
      });

      // Cleanup on component unmount
      return () => chart.destroy();
    }
  }, [orders]);

  // Other parts of the SAdminLogistics component (filtering, order list, etc.)
    
    
    
  // Filter orders by date
  const filteredOrders = filterDate
    ? orders.filter(order => new Date(order.createdAt).toDateString() === new Date(filterDate).toDateString())
    : orders;


        
  // Calculate the orders to show based on the current page
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
    };
    


  // Get user name from user ID
  const getUserName = (userId) => {
    const user = users.find(user => user._id === userId);
    return user ? user.username : 'Unknown User';
  };

    

//   const [routes, setRoutes] = useState([]);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [editRowId, setEditRowId] = useState(null);
//   const [routeData, setRouteData] = useState({ startLocation: '', endLocation: '', size: '', price: '' });

//   useEffect(() => {
//       loadRoutes();
//     }, []);
  
//     const loadRoutes = async () => {
//       const data = await fetchRoutes();
//       setRoutes(data);
//     };
  
//     const handleAddRoute = async () => {
//       await addRoute(routeData);
//       loadRoutes();
//       setShowAddModal(false);
//     };
  
//     const handleEditRoute = (route) => {
//       setEditRowId(route._id);
//       setRouteData({ ...route });
//     };
  
//     const handleUpdateRoute = async () => {
//       await updateRoute(editRowId, routeData);
//       loadRoutes();
//       setEditRowId(null);
//     };
  
//     const handleDeleteRoute = async (id) => {
//       await deleteRoute(id);
//       loadRoutes();
//     };
  

    
    
    
    
const [routes, setRoutes] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showSizeModal, setShowSizeModal] = useState(false);
    const [showGoodsWorthModal, setShowGoodsWorthModal] = useState(false);
const [editRowId, setEditRowId] = useState(null);
const [routeData, setRouteData] = useState({
  startLocation: '',
  endLocation: '',
  logisticsDetail: {
    size: [],
    goodsworth: [],
  },
});

// const [showSizeModal, setShowSizeModal] = useState(false);
const [showSizeListModal, setShowSizeListModal] = useState(false);
// const [showGoodsWorthModal, setShowGoodsWorthModal] = useState(false);
const [showGoodsWorthListModal, setShowGoodsWorthListModal] = useState(false);
// const [editRowId, setEditRowId] = useState(null);

 // New state for size and goods worth inputs
 const [sizeData, setSizeData] = useState({
    weightKg: '',
    amount: '',
  });
  const [goodsWorthData, setGoodsWorthData] = useState({
    grade: '',
    amount: '',
  });

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
      const data = await fetchRoutes();
      console.log(data);
      setRoutes(data.data);
      // Check if the data structure matches what you expect
    // if (data && Array.isArray(data)) {
    //   setRoutes(data);
    // } else {
    //   setRoutes([]); // Set empty array if data is null or not in expected format
    // }
  };


  const handleAddRoute = async () => {
    try {
      if (!routeData.startLocation || !routeData.endLocation) {
        alert('Please provide both start and end locations.');
        return;
      }

      await addRoute(routeData); // Add the new route
      loadRoutes(); // Refresh the route list to include the new route
      setShowAddModal(false); // Close the modal
    } catch (error) {
      console.error('Error adding route:', error);
    }
  };

  const handleEditRoute = (route) => {
    setEditRowId(route);
    setRouteData({
      startLocation: route.startLocation,
      endLocation: route.endLocation,
      logisticsDetail: {
        size: route.logisticsDetail.size || [],
        goodsworth: route.logisticsDetail.goodsworth || [],
      },
    });
  };

const handleUpdateRoute = async () => {
    try {
      await updateRoute(editRowId, routeData); // Update the route
      loadRoutes(); // Refresh the route list
      setEditRowId(null); // Clear the edit row ID
    } catch (error) {
      console.error('Error updating route:', error);
    }
  };

  const handleDeleteRoute = async (id) => {
    try {
      await deleteRoute(id); // Delete the route
      loadRoutes(); // Refresh the route list
    } catch (error) {
      console.error('Error deleting route:', error);
    }
  };


  // Handle adding size detail to the route
  const handleAddSizeDetail = async (routeId) => {
    try {
      if (!sizeData.weightKg || !sizeData.amount) {
        alert('Please provide both weight and amount for size.');
        return;
      }

      await addSizeDetail(routeId, sizeData); // Add size detail to the route
      loadRoutes(); // Refresh the route list
      setShowSizeModal(false); // Close the size modal
    } catch (error) {
      console.error('Error adding size detail:', error);
    }
  };

 // Handle adding goods worth detail to the route
 const handleAddGoodsWorthDetail = async (routeId) => {
    try {
      if (!goodsWorthData.grade || !goodsWorthData.amount) {
        alert('Please provide both grade and amount for goods worth.');
        return;
      }

      await addGoodsWorthDetail(routeId, goodsWorthData); // Add goods worth detail
      loadRoutes(); // Refresh the route list
      setShowGoodsWorthModal(false); // Close the goods worth modal
    } catch (error) {
      console.error('Error adding goods worth detail:', error);
    }
  };

  const handleDeleteSize = async (routeId, index) => {
  
    try {
      const response = await DeleteSize(routeId, index);
    
      if (response.status === 200) {
        setShowSizeListModal(false); // Close the size modal
  
        // Update the routes state directly
        const updatedRoutes = routes.map(route => 
          route._id === routeId 
            ? { 
                ...route, 
                logisticsDetail: { 
                  ...route.logisticsDetail, 
                  size: route.logisticsDetail.size.filter((_, i) => i !== index) 
                } 
              } 
            : route
        );
        setRoutes(updatedRoutes); // Update the state to reflect the deleted size
      }
    } catch (error) {
      console.error('Failed to delete size:', error);
    }
  };
  
    
    const handleDeleteGoodsWorth = async (routeId, index) => {
        console.log(routeId)

    try {
      const response = await DeleteGoodsWorth(routeId, index);
      if (response.status === 200) {
        setShowGoodsWorthListModal(false); // Close the goods worth modal
        loadRoutes(); // Refresh the route list
        // Update your routes state to reflect the deleted size
        // const updatedRoutes = routes.map(route => 
        //   route._id === routeId 
        //     ? { 
        //         ...route, 
        //         logisticsDetail: { 
        //           ...route.logisticsDetail, 
        //           size: route.logisticsDetail.size.filter((_, i) => i !== index) 
        //         } 
        //       } 
        //     : route
        // );
        // setRoutes(updatedRoutes);       
      }
    } catch (error) {
      console.error('Failed to delete size:', error);
    }
  };
//   // Function to open a specific modal and set the route ID
// const handleOpenModal4 = (modalType, routeId) => {
//     setEditRowId(routeId);
//     switch (modalType) {
//       case 'addSize':
//         setShowSizeModal(true);
//         break;
//       case 'viewSizes':
//         setShowSizeListModal(true);
//         break;
//       case 'addGoodsWorth':
//         setShowGoodsWorthModal(true);
//         break;
//       case 'viewGoodsWorth':
//         setShowGoodsWorthListModal(true);
//         break;
//       default:
//         break;
//     }
//   };
  
//   // Function to close all modals and reset the editRowId
//   const handleCloseModal4 = () => {
//     setShowSizeModal(false);
//     setShowSizeListModal(false);
//     setShowGoodsWorthModal(false);
//     setShowGoodsWorthListModal(false);
//     setEditRowId(null);
//   };

    
  return (
      <div className="p-4 space-y-2 bg-gray-100">
          {/* this section is the button to create and edit the logistic route  */}
          <div className=" space-y-2 bg-gray-100">
      <div className="">
        <h1 className="text-3xl font-semibold mb-4">Logistics Routes</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-itccolor text-white rounded hover:bg-orange-800 mb-6"
        >
          Add Route
        </button>

        {/* Modal for adding or editing a route */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-2xl font-semibold mb-4">
                {editRowId ? 'Edit Route' : 'Add Route'}
              </h2>

              {/* Start Location Input */}
              <input
                type="text"
                value={routeData.startLocation}
                onChange={(e) => setRouteData({ ...routeData, startLocation: e.target.value })}
                placeholder="Start Location"
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* End Location Input */}
              <input
                type="text"
                value={routeData.endLocation}
                onChange={(e) => setRouteData({ ...routeData, endLocation: e.target.value })}
                placeholder="End Location"
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                                    //   onClick={editRowId ? handleUpdateRoute : handleAddRoute}
                                      onClick={handleAddRoute}

                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                                      {/* {editRowId ? 'Update Route' : 'Add Route'} */}
                                      Add Route
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for adding size details */}
        {showSizeModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-2xl font-semibold mb-4">Add Size Detail</h2>

              {/* Weight Kg Input */}
              <input
                type="number"
                value={sizeData.weightKg}
                onChange={(e) => setSizeData({ ...sizeData, weightKg: e.target.value })}
                placeholder="Weight (kg)"
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Amount Input */}
              <input
                type="number"
                value={sizeData.amount}
                onChange={(e) => setSizeData({ ...sizeData, amount: e.target.value })}
                placeholder="Amount"
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => handleAddSizeDetail(editRowId)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Add Size
                </button>
                <button
                  onClick={() => setShowSizeModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for adding goods worth details */}
        {showGoodsWorthModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-2xl font-semibold mb-4">Add Goods Worth Detail</h2>

              {/* Grade Input */}
              <input
                type="text"
                value={goodsWorthData.grade}
                onChange={(e) => setGoodsWorthData({ ...goodsWorthData, grade: e.target.value })}
                placeholder="Grade"
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Amount Input */}
              <input
                type="number"
                value={goodsWorthData.amount}
                onChange={(e) => setGoodsWorthData({ ...goodsWorthData, amount: e.target.value })}
                placeholder="Amount"
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => handleAddGoodsWorthDetail(editRowId)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Add Goods Worth
                </button>
                <button
                  onClick={() => setShowGoodsWorthModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

       
                   {/* Routes Table */}
        {/* <table className="min-w-full table-auto"> */}
   
          {/* <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-sm"> */}
          <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-sm">

  {/* <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Routes</h2> */}
  
  <div className="overflow-y-auto h-40">
    {routes.length > 0 ? (
      routes.map((route) => (
        <div
          key={route._id}
          className="flex items-center justify-between bg-gray-50 rounded-lg p-4 mb-2 mx-4 my-2 shadow-md hover:bg-gray-100 transition-colors"
        >
          {/* Start and End Locations */}
          <div className="w-1/4 text-gray-800 font-medium">
            {route.startLocation} - {route.endLocation}
          </div>

          {/* Size Actions */}
          <div className="flex items-center space-x-2">
           
            <button
              onClick={() => {
                setShowSizeListModal(true);
                setEditRowId(route._id);
              }}
              className="text-white flex items-center rounded-lg w-[5rem] space-x-1"
            >
              {/* <AiOutlineEye className='text-lg p-2 m-2' /> */}
              <span  className='text-sm  text-itccolor items-center p-2 '>View Sizes</span>
            </button>
            <button
              onClick={() => {
                setShowGoodsWorthListModal(true);
                setEditRowId(route._id);
              }}
              className="text-green-50 flex items-center  rounded-lg   w-[8rem] space-x-1"
            >
              {/* <AiOutlineEye className='text-lg p-2 m-2' /> */}
              <span  className='text-sm  text-itccolor items-center p-2' >View Item Worth</span>
            </button>
          </div>

          {/* Goods Worth Actions */}
          <div className="flex items-center space-x-2">
           
          <button
              onClick={() => {
                setShowSizeModal(true);
                setEditRowId(route._id);
              }}
              className="text-gray-50 flex items-center  rounded-lg bg-itccolor w-[6rem] space-x-1"
            >
              {/* <AiOutlinePlus className='text-lg p-2 m-2' /> */}
              <div  className='text-sm items-center p-2 flex space-x-2 '><IoMdAddCircle />
 <div> Size</div></div>
            </button>

            <button
              onClick={() => {
                setShowGoodsWorthModal(true);
                setEditRowId(route._id);
              }}
              className="text-gray-50 flex items-center  rounded-lg  bg-itccolor w-[8rem] space-x-1"
            >
              {/* <AiOutlinePlus className='text-lg p-2 m-2' /> */}
              <div  className='text-sm items-center p-2 flex space-x-2 '><IoMdAddCircle />
 <div> Item Worth</div></div>
            </button>
          </div>

          {/* Edit and Delete Actions */}
          <div className="flex items-center space-x-4">
            {/* <button
              onClick={() => handleEditRoute(route._id)}
              className="text-green-500 flex items-center"
            >
              <FiEdit />
            </button> */}
            <button
              onClick={() => handleDeleteRoute(route._id)}
              className="text-red-500 flex rounded-full p-2 bg-itccolor items-center"
            >
              <FiTrash2 className='text-white' />
            </button>
          </div>
        </div>
      ))
    ) : (
      <div className="text-center text-gray-500 py-4">No routes available.</div>
    )}
  </div>
</div>


                      

                      
                      
{/* {showSizeModal && (
  <Modal onClose={() => setShowSizeModal(false)}>
    <h2>Add Size</h2>
    <form onSubmit={handleAddSize}>
      <label>
        Weight (kg):
        <input type="number" name="weightKg" required />
      </label>
      <label>
        Amount:
        <input type="number" name="amount" required />
      </label>
      <button type="submit">Add</button>
    </form>
  </Modal>
)} */}

{showSizeListModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 p-6 rounded-lg shadow-lg relative">
      <button
        onClick={() => setShowSizeListModal(false)}
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        &times;
      </button>
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">List of Sizes</h2>
      
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-4 border-b">Weight (kg)</th>
            <th className="py-3 px-4 border-b">Amount (₦)</th>
            <th className="py-3 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm">
          {routes
            .find((r) => r._id === editRowId)
            .logisticsDetail.size.map((size, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="py-3 px-4 border-b">{size.weightKg}</td>
                <td className="py-3 px-4 border-b">₦{size.amount}</td>
                <td className="py-3 px-4 border-b">
                  <button
                    onClick={() => handleDeleteSize(editRowId, index)}
                    className="text-red-600 hover:text-red-800 focus:outline-none font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  </div>
)}

                      
{/* {showGoodsWorthModal && (
  <Modal onClose={() => setShowGoodsWorthModal(false)}>
    <h2>Add Goods Worth</h2>
    <form onSubmit={handleAddGoodsWorth}>
      <label>
        Grade:
        <input type="text" name="grade" required />
      </label>
      <label>
        Amount:
        <input type="number" name="amount" required />
      </label>
      <button type="submit">Add</button>
    </form>
  </Modal>
)} */}

                      

{showGoodsWorthListModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 p-6 rounded-lg shadow-lg relative">
      <button
        onClick={() => setShowGoodsWorthListModal(false)}
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        &times;
      </button>
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">List of Goods Worth</h2>
      
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-4 border-b">Grade</th>
            <th className="py-3 px-4 border-b">Amount (₦)</th>
            <th className="py-3 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm">
          {routes
            .find((r) => r._id === editRowId)
            .logisticsDetail.goodsworth.map((goods, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="py-3 px-4 border-b">{goods.grade}</td>
                <td className="py-3 px-4 border-b">₦{goods.amount}</td>
                <td className="py-3 px-4 border-b">
                  <button
                    onClick={() => handleDeleteGoodsWorth(editRowId, index)}
                    className="text-red-600 hover:text-red-800 focus:outline-none font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  </div>
)}

                      



      





      </div>
    </div>

          {/* First Layer: Graph for Logistics Stats */}
          <div className='grid md:grid-cols-3 gap-4'>
              <div className='col-span-2'>
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Monthly Logistics Overview</h2>
        <canvas ref={chartRef} className="h-64"></canvas>
      </section>
      </div>
             {/* Second Layer: Summary Metrics */}
{/* Second Layer: Summary Metrics */}
{/* Second Layer: Summary Metrics */}
<div className="">
  <section className="grid gap-4">
    <div className="bg-white p-2 rounded-lg shadow-md text-center">
      <h3 className="text-md font-semibold">Total Logistics</h3>
      <p className="text-sm text-gray-400">(This Month)</p>
      <p className="text-md font-bold p-2 rounded-md bg-gray-200 text-blue-600">
        {monthlyLogistics?.monthlyOrders?.length || 0} {/* Show total count of orders for this month */}
      </p>
    </div>
    <div className="bg-white p-2 rounded-lg shadow-md text-center">
      <h3 className="text-md font-semibold">Total Logistics</h3>
      <p className="text-sm text-gray-400">((Year))</p>
      <p className="text-md font-bold p-2 rounded-md bg-gray-200 text-green-600">
        {yearlyLogistics?.yearlyOrders || 0} {/* Show total count of orders for the year */}
      </p>
    </div>
    <div className="bg-white p-2 rounded-lg shadow-md text-center">
      <h3 className="text-md font-semibold">Top Location</h3>
      <p className="text-sm text-gray-400">(Transactions)</p>
      <p className="text-md font-bold p-2 rounded-md bg-gray-200 text-purple-600">
        {topLocation?.topLocation || 'N/A'} {/* Extract topLocation as a string */}
      </p>
    </div>
  </section>
</div>



      </div>
      {/* Third Layer: Order List with Filter and Modal */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Logistics Order List</h2>
        
   {/* Filter by Date */}
   <div className="mb-4">
          <label htmlFor="filter-date" className="block text-sm font-medium text-gray-700">Filter by Date</label>
          <input
            type="date"
            id="filter-date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <table className="min-w-full bg-white border border-gray-300 rounded-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-2 border-b">Sign Off Name</th>
              <th className="px-4 py-2 border-b">Size</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">Amount</th>
              <th className="px-4 py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-100 transition duration-150">
                <td className="px-4 py-2 border-b">{getUserName(order.userId)}</td>
                <td className="px-4 py-2 border-b">{order.size}</td>
                <td className="px-4 py-2 border-b">{order.status}</td>
                <td className="px-4 py-2 border-b">{order.amount}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-blue-600 hover:text-blue-800 transition duration-150"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
 {/* Pagination Controls */}
 <div className="flex justify-between mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-itccolor text-white' : 'bg-itccolor text-white hover:bg-orange-800'}`}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-itccolor text-white' : 'bg-itccolor text-white hover:bg-orange-800'}`}
          >
            Next
          </button>
              </div>
              
      </section>

      {/* Overlay Modal for Order Details */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                  <div className="bg-white p-6 rounded-lg w-1/2 relative">
                      <div className='p-6 bg-itccolor'>
            <button
              className="absolute top-6 p-2 right-4 text-white hover:text-gray-400"
              onClick={() => setSelectedOrder(null)}
            >
              Close
            </button>
                          <h3 className="text-xl font-semibold mb-4 text-white">Order Details</h3>
                          </div>
            <p className='p-2 border-b-[1px] border-gray-400'><strong>Tracking Code:</strong> {selectedOrder.trackingCode}</p>
            <p className='p-2 border-b-[1px] border-gray-400'><strong>Sender Name:</strong> {selectedOrder.sender_name}</p>
            <p className='p-2 border-b-[1px] border-gray-400'><strong>Sender Phone:</strong> {selectedOrder.sender_phone}</p>
            <p className='p-2 border-b-[1px] border-gray-400'><strong>Sender Email:</strong> {selectedOrder.sender_email}</p>
            <p className='p-2 border-b-[1px] border-gray-400'><strong>Sender Address:</strong> {selectedOrder.sender_address}</p>
            <p className='p-2 border-b-[1px] border-gray-400'><strong>Receiver Name:</strong> {selectedOrder.receiver_name}</p>
            <p className='p-2 border-b-[1px] border-gray-400'><strong>Receiver Phone:</strong> {selectedOrder.receiver_phone}</p>
            <p className='p-2 border-b-[1px] border-gray-400'><strong>Receiver Email:</strong> {selectedOrder.receiver_email}</p>
            <p className='p-2 border-b-[1px] border-gray-400'><strong>Receiver Address:</strong> {selectedOrder.receiver_address}</p>
            <div className="mt-4">
              <h4 className="font-semibold">Location History:</h4>
              <ul className="list-disc list-inside">
                {selectedOrder.locationHistory.map((location, index) => (
                  <li key={index}>
                    {location.location} (Updated: {new Date(location.updatedAt).toLocaleString()})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SAdminLogistics;
