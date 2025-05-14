import React, { useState, useContext, useEffect } from 'react';
import { createOrder,  fetchOrdersById, deleteOrder, trackOrder, confirmLocation, UpdateStatus, fetchRoutes } from '../../services/logisticsService';
import AuthContext from '../../context/AuthContext';
import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';
import { FaMapMarkerAlt, FaRulerCombined, FaDollarSign, FaBarcode, FaTruck } from "react-icons/fa";

import html2pdf from 'html2pdf.js';
const OrderForm = ({ token }) => {
    const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
    const [deleteStatus, setDeleteStatus] = useState(null);
    const [isOverviewVisible, setIsOverviewVisible] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [filterDate, setFilterDate] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [trackingCode, setTrackingCode] = useState('');
    const [orderDetails, setOrderDetails1] = useState(null);
    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const [trackingCodeLocatctionComfirmation, setTrackingCodeLocatctionComfirmation] = useState('');
    const [location, setLocation] = useState('');
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);
    const [trackingCode1, setTrackingCode1] = useState('');
  const [message1, setMessage1] = useState('');
  const [successData, setSuccessData] = useState([]);
    const [isError1, setIsError1] = useState(false);
  const [formData, setFormData] = useState({ size: '', sizeWeight: '',  goodsworth: '', goodGrade: '', destination: '', transitroute: '', amount: '', sender_phone: '', sender_email: '', sender_name: '', sender_address: '', reciever_phone: '', reciever_email: '', reciever_name: '', reciever_address: '', userId: user._id });
    // const isFormComplete = Object.values(formData).every(field => field.trim() !== '');
    const isFormComplete = Object.values(formData).every(
      (field) => typeof field === 'string' ? field.trim() !== '' : field !== ''
    );
    
    const [routes, setRoutes] = useState([]);
  // const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const [selectedRouteData, setSelectedRouteData] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  
  
  const PAYMENT_TIME = process.env.REACT_APP_PAYMENT_KEY; // Updated to match the correct variable name



    useEffect(() => {
        const loadOrders = async () => {
            const fetchedOrders = await fetchOrdersById(user._id);
            console.log('Fetched Orders:', fetchedOrders);  // Debug line
            setOrders(Array.isArray(fetchedOrders) ? fetchedOrders : []);  
        //   setOrders(fetchedOrders);
        };
        loadOrders();
      }, []);
      const handleDelete = async (orderId) => {
        try {
          await deleteOrder(orderId);
          setOrders(orders.filter(order => order._id !== orderId));
          setDeleteStatus(`Order with ID ${orderId} has been deleted successfully.`);
        } catch (error) {
          setDeleteStatus(`Failed to delete order with ID ${orderId}: ${error.message}`);
        }
    };

    // useEffect(() => {
    //     const loadRoutes = async () => { // Renamed to avoid naming conflict
    //         try {
    //             const data = await fetchRoutes(); // Imported function
    //             console.log(data, "hoko")
    //             setRoutes(data);
    //         } catch (error) {
    //             console.error('Error fetching routes:', error);
    //         }
    //     };
     
    //     loadRoutes();
    //  }, []);
     
  
  
     useEffect(() => {
      const loadRoutes = async () => {
          try {
              const response = await fetchRoutes();
              const data = response.data;
              if (Array.isArray(data)) {
                  setRoutes(data);
              } else {
                  console.error('Fetched routes data is not an array:', data);
              }
          } catch (error) {
              console.error('Error fetching routes:', error);
          } finally {
              setLoading(false); // Stop loading once the data is fetched or on error
          }
      };
      loadRoutes();
  }, []);
  
     console.log(routes, 'obodo')

 
    
    
    //   const handleRouteChange = (e) => {
    //     const selectedRoute = e.target.value;
    //     setFormData((prevData) => ({
    //       ...prevData,
    //       route: selectedRoute,
    //       size: '', // Reset size when route changes
    //       amount: '', // Reset amount when route changes
    //     }));
    
    //     // Logic to set size options based on selected route
    //     const selectedRouteData = routes.find((route) => route._id === selectedRoute);
    //     if (selectedRouteData) {
    //       // Populate size based on the selected route
    //       // Assume size options are available in the route data
    //       setFormData((prevData) => ({
    //         ...prevData,
    //         sizeOptions: selectedRouteData.sizes,
    //       }));
    //     }
    //   };
    
  
  
  
    //   const handleSizeChange = (e) => {
    //     const selectedSize = e.target.value;
    //     setFormData((prevData) => ({
    //       ...prevData,
    //       size: selectedSize,
    //     }));
    
    //     // Logic to calculate amount based on selected size and route
    //     const selectedRouteData = routes.find((route) => route.id === formData.route);
    //     if (selectedRouteData) {
    //       const selectedSizeData = selectedRouteData.sizes.find((size) => size.name === selectedSize);
    //       if (selectedSizeData) {
    //         setFormData((prevData) => ({
    //           ...prevData,
    //           amount: selectedSizeData.price, // Assuming price is a property of the size
    //         }));
    //       }
    //     }
    //   };


    

   
    // Filter orders based on the selected date
    const filteredOrders = filterDate
      ? orders.filter(order => new Date(order.createdAt).toDateString() === new Date(filterDate).toDateString())
      : orders;

    
  
    const handleRouteChange = (e) => {
      const selectedRouteId = e.target.value;
      const routeData = routes.find(route => route._id === selectedRouteId);
      
      setFormData(prevData => ({
          ...prevData,
          route: selectedRouteId,
          size: '',
          goodsworth: '',
          amount: ''
      }));

      if (routeData) {
          setSelectedRouteData(routeData);
      }
  };



  useEffect(() => {
    const selectedSize = selectedRouteData?.logisticsDetail?.size?.find(size => size._id === formData.size);
    const selectedGoodsworth = selectedRouteData?.logisticsDetail?.goodsworth?.find(good => good._id === formData.goodsworth);
    
    const sizeAmount = selectedSize ? selectedSize.amount : 0;
    const goodsworthAmount = selectedGoodsworth ? selectedGoodsworth.amount : 0;

    setTotalAmount(sizeAmount + goodsworthAmount);
    // setAmountForm()
}, [formData.size, formData.goodsworth, selectedRouteData]);





  // const handleSizeChange = (e) => {
  //     const selectedSize = e.target.value;
  //     setFormData(prevData => ({ ...prevData, size: selectedSize }));
      
  //     // Find selected size amount
  //     const sizeData = selectedRouteData.size.find(size => size._id === selectedSize);
  //     const sizeAmount = sizeData ? sizeData.amount : 0;
      
  //     // Calculate total amount based on selected size and goodsworth
  //     const goodsworthAmount = formData.goodsworth
  //         ? selectedRouteData.goodsworth.find(worth => worth._id === formData.goodsworth)?.amount || 0
  //         : 0;

  //     setFormData(prevData => ({
  //         ...prevData,
  //         amount: sizeAmount + goodsworthAmount
  //     }));
  // };

  // const handleGoodsworthChange = (e) => {
  //     const selectedGoodsworth = e.target.value;
  //     setFormData(prevData => ({ ...prevData, goodsworth: selectedGoodsworth }));
      
  //     // Find selected goodsworth amount
  //     const goodsworthData = selectedRouteData.goodsworth.find(worth => worth._id === selectedGoodsworth);
  //     const goodsworthAmount = goodsworthData ? goodsworthData.amount : 0;

  //     // Calculate total amount based on selected size and goodsworth
  //     const sizeAmount = formData.size
  //         ? selectedRouteData.size.find(size => size._id === formData.size)?.amount || 0
  //         : 0;

  //     setFormData(prevData => ({
  //         ...prevData,
  //         amount: sizeAmount + goodsworthAmount
  //     }));
  // };
  

  const handleSizeChange = (e) => {
    const selectedSizeId = e.target.value;
    const selectedSize = selectedRouteData?.logisticsDetail?.size?.find(size => size._id === selectedSizeId);

    setFormData(prevData => ({
        ...prevData,
        size: selectedSizeId,
        amount: selectedSize ? selectedSize.amount : ''
    }));
};
  const handleGoodsworthChange = (e) => {
    const selectedGoodsworthId = e.target.value;
    const selectedGoodsworth = selectedRouteData?.logisticsDetail?.goodsworth?.find(good => good._id === selectedGoodsworthId);

    setFormData(prevData => ({
        ...prevData,
        goodsworth: selectedGoodsworthId,
        amount: selectedGoodsworth ? (parseFloat(formData.amount) + selectedGoodsworth.amount).toString() : formData.amount
    }));
};

  // Automatically set formData.amount whenever totalAmount changes
  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      amount: totalAmount, // Set the amount field to totalAmount
    }));
  }, [totalAmount]);

    
      const handleSubmit3 = async (e) => {
        e.preventDefault();
        setMessage(''); // Reset message
        try {
            const response = await UpdateStatus(trackingCode1);
          setMessage1(response.data.message);
          setIsError1(false);
        } catch (error) {
          setMessage1(error.response?.data.message || 'Error updating order status');
          setIsError1(true);
        }
      };
    
    
      const handleViewOrder = async () => {
        // Simulate an API call to fetch order details
        // Replace this part with your actual API call
        try {

          const data = await trackOrder(trackingCode);
          console.log(data)
          setOrderDetails1(data);
          setIsModalOpen1(true);
        } catch (error) {
          alert('Error: No record found. Check the code and try again.'); // Alert if no record is found
        }
    };
    

    const handleSubmit2 = async (e) => {
        e.preventDefault();
    
        try {
          
          await confirmLocation(trackingCode, location, token);
          setMessage('Location updated successfully!');
          setIsError(false);
        } catch (error) {
          setMessage('Error: Order not found. Check the code and try again.');
          setIsError(true);
        }
      };


    const closeModal1 = () => {
        setIsModalOpen1(false);
        setOrderDetails1(null); // Reset order details on close
      };
    
      const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
      };
    
      const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
      };

    
const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsOverviewVisible(true); // Show order overview before payment
    };
    

  
  
  //   const [modalOpen, setModalOpen] = useState(true);

  // const closeModal5 = () => {
  //   setModalOpen(false);
  // };

    const paymentConfig = {
        public_key: PAYMENT_TIME,
        tx_ref: Date.now().toString(),
        amount: formData.amount,
        currency: 'NGN',
        payment_options: 'card, mobilemoney, ussd',
        customer: {
          email:  formData.sender_email,
          phonenumber:  formData.sender_phone,
          name:  formData.sender_name,
        },
        customizations: {
          title: 'ITC Logistics Payment',
          description: 'Payment for ITC Logistics',
          logo: '/image/ITCLogoBrown.png', // Replace with your logo URL
        },
        callback: async (response) => {
          if (response.status === 'successful') {
            try {
        //       const { tx_ref, transaction_id, charged_amount, created_at } = response;
        // setTx_ref(tx_ref)
        // settransaction_id(transaction_id)
        // setcreated_at(created_at)
        //       setcharged_amount(charged_amount)
              
              const data = await createOrder(formData, token); // Save order after successful payment
              console.log("Order Created:", data);
              setOrders(prevOrders => [...prevOrders, data]);
              setSuccessData(data)
              setPaymentSuccess(true);
            } catch (error) {
              console.error("Failed to create order:", error);
            }
          } else {
            console.error("Payment failed:", response);
          }
          setIsOverviewVisible(false); // Hide overview modal
          closePaymentModal(); // Close Flutterwave modal
        },
        onClose: () => {
          console.log("Payment modal closed");
          setIsOverviewVisible(false);
        },
    };
    
  
  
  const handleDownload = () => {
    const element = document.getElementById('order-summary');
    
    // Generate the PDF from the div
    const options = {
      margin: 1,
      filename: 'order-summary.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().from(element).set(options).save().then(() => {
      setPaymentSuccess(false); // Close modal after download starts
    });
  };
  

    return (
        <>
            
            <div className="flex flex-col md:flex-row items-center justify-center  bg-white space-y-2 md:space-y-0 md:space-x-2">
  {/* Confirm Location of Logistics */}
                {/* <div className="flex items-center justify-center w-full "> */}
                       {/* update the status */}

                <div className="flex flex-col w-full items-center justify-center m-4 bg-gray-100">
      <div className="w-full max-w-md p-2 bg-white rounded-lg shadow-sm">
        <h2 className="text-md font-semibold text-left text-gray-700 mb-2">Update Logistics Status</h2>

        {/* Success/Error Message */}
        {message1 && (
          <div
            className={`text-sm p-3 mb-4 rounded ${isError ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}
          >
            {message1}
          </div>
        )}

        <form onSubmit={handleSubmit3} className="space-y-4">
          {/* Tracking Code Input */}
          <div>
            <label htmlFor="trackingCode" className="block text-[10px] font-medium text-gray-700">
              Tracking Code
            </label>
            <input
              type="text"
              id="trackingCode"
              value={trackingCode1}
              onChange={(e) => setTrackingCode1(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Tracking Code"
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 text-white bg-itccolor text-sm md:text-md hover:bg-itccolor transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-orange-800"
            >
              Sign off Logistics
            </button>
          </div>
        </form>
      </div>
                    </div>
                    
{/* update location */}

    <div className="w-full  p-2 bg-white my-2 rounded-lg shadow-md">
      <h2 className="text-md font-semibold text-left text-gray-700 mb-2">Update Logistics Location</h2>
      {/* Success/Error Message */}
      {message && (
        <div
          className={`text-sm p-3 mb-4 rounded ${isError ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}
        >
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit2} className="space-y-4">
        {/* Tracking Code Input */}
        <div>
          {/* <label htmlFor="trackingCode" className="block text-sm font-medium text-gray-700">
            Tracking Code
          </label> */}
          <input
            type="text"
            id="trackingCode"
            value={trackingCodeLocatctionComfirmation}
            onChange={(e) => setTrackingCodeLocatctionComfirmation(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Tracking Code"
            required
          />
        </div>
                
        {/* Location Input */}
        <div>
          {/* <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            New Location
          </label> */}
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter New Location"
            required
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 text-white bg-itccolor hover:bgorange-800 text-sm md:text-md transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Update Location
          </button>
        </div>
      </form>
    </div>
  {/* </div> */}

  {/* View Logistic by Code */}
  <div className="flex items-center my-2 justify-center w-full ">
    <div className="w-full max-w-md p-2 bg-white rounded-lg shadow-sm">
      <h2 className="text-md font-bold mb-4">View Order Details</h2>

      <div className="mb-4">
        <label htmlFor="tracking-code" className="block text-sm font-medium text-gray-700">Enter Tracking Code</label>
        <input
          type="text"
          id="tracking-code"
          value={trackingCode}
          onChange={(e) => setTrackingCode(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-orange-800"
          placeholder="e.g. ABC123456"
        />
      </div>

      <button
        onClick={handleViewOrder}
        className="bg-itccolor text-white py-2 px-4 w-full  text-sm md:text-md rounded hover:bg-orange-800 transition duration-150"
      >
        View Logistics
      </button>

      {/* Modal Overlay */}
      {isModalOpen1 && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                                <div className="bg-white shadow-sm mb-2 rounded-lg p-4  ">
                                    <div className='bg-itccolor w-full mb-2'>
                                        <h2 className="text-lg text-white font-bold p-6">Logistics Details</h2>
                                        </div>
            {orderDetails ? (
                      // <div className="overflow-x-auto">
                        <div className="overflow-x-auto">
             <table className="w-[20rem] bg-white border border-gray-200">
               {/* Logistics Details */}
                          <thead>
                          <div className="bg-white shadow-lg mb-2 rounded-lg p-6 w-1/3 w-[20rem] space-y-4">
                              <div className="grid grid-flow-col justify-stretch items-center   gap-4">
                                <div className='flex items-center gap-4'>
        <FaMapMarkerAlt className="text-blue-500 text-xl" />
        <div>
          <p className="text-[10px] font-semibold text-gray-700">Order Destination</p>
          <p className="text-gray-600 text-[8px]">{orderDetails.transitroute}</p>
        </div>
                              </div>
          <div className="flex items-center gap-4">
        <FaBarcode className="text-orange-500 text-xl" />
        <div>
          <p className="text-[9px] font-semibold text-gray-700">Tracking Code</p>
          <p className="text-gray-600 font-bold text-[10px]">{orderDetails.trackingCode}</p>
        </div>
                                </div>
                                </div>
                              


<div className='grid grid-flow-col justify-stretch '>
     
   
    
      <div className="flex items-center gap-4">
        <FaTruck className="text-red-500 text-xl" />
        <div>
          <p className="text-[8px] font-semibold text-gray-700">Status</p>
          <p className="text-gray-600 text-[10px]">{orderDetails.status}</p>
        </div>
                                </div>


                                <div className="flex items-center gap-4">
        {/* <FaRulerCombined className="text-purple-500 text-xl" /> */}
        <div>
          <p className="text-[8px] font-semibold text-gray-700">Size</p>
          <p className="text-[10px] text-gray-600">{orderDetails.sizeWeight}</p>
        </div>
                                </div>
                                <div className="flex items-center gap-4">
        {/* <FaDollarSign className="text-green-500 text-xl" /> */}
        <div>
          <p className="text-[9px] font-semibold text-gray-700">Amount</p>
          <p className="text-gray-600 font-bold text-[10px]">{orderDetails.amount}</p>
        </div>
      </div>
                              </div>
                              


    </div>
                 {/* <tr>
                    <th colSpan="2" className="px-4 py-2 bg-gray-100 text-left text-gray-700 font-semibold border-b">
                     Logistics Details
                   </th> 
                 </tr> */}
               </thead>
                          <tbody>
                            
              
               </tbody>
           
                          {/* Sender Details colSpan="2" */}
                          <div className=''>
                       
               <thead>
                 <tr>
                   <th    className="px-4 py-2  text-left w-full text-gray-700 font-semibold ">
                     Sender Details
                   </th>
                 </tr>
               </thead>
               <tbody>
                 <tr>
                   <td className="px-4 py-2 border-b text-[10px] font-semibold">Sender Name</td>
                   <td className="px-4 py-2 border-b text-[10px]">{orderDetails.sender_name}</td>
                 </tr>
                 <tr>
                   <td className="px-4 py-2 border-b text-[10px] font-semibold">Sender Phone</td>
                   <td className="px-4 py-2 border-b text-[10px]">{orderDetails.sender_phone}</td>
                 </tr>
                 <tr>
                   <td className="px-4 py-2 border-b text-[10px] font-semibold">Sender Email</td>
                   <td className="px-4 py-2 border-b text-[10px]">{orderDetails.sender_email}</td>
                 </tr>
                 <tr>
                   <td className="px-4 py-2 border-b text-[10px] font-semibold">Sender Address</td>
                   <td className="px-4 py-2 border-b text-[10px]">{orderDetails.sender_address}</td>
                 </tr>
               </tbody>
           
               {/* Receiver Details */}
               <thead>
                 <tr>
                   <th colSpan="2" className="px-4 py-2 bg-gray-100 text-left text-gray-700 font-semibold border-b">
                     Receiver Details
                   </th>
                 </tr>
               </thead>
               <tbody>
                 <tr>
                   <td className="px-4 py-2 border-b text-[10px] font-semibold">Receiver Name</td>
                   <td className="px-4 py-2 border-b text-[10px]">{orderDetails.reciever_name}</td>
                 </tr>
                 <tr>
                   <td className="px-4 py-2 border-b text-[10px] font-semibold">Receiver Phone</td>
                   <td className="px-4 py-2 border-b text-[10px] ">{orderDetails.reciever_email}</td>
                 </tr>
                 <tr>
                   <td className="px-4 py-2 border-b text-[10px] font-semibold">Receiver Email</td>
                   <td className="px-4 py-2 border-b text-[10px]">{orderDetails.reciever_email}</td>
                 </tr>
                 <tr>
                   <td className="px-4 py-2 border-b text-[10px] font-semibold">Receiver Address</td>
                   <td className="px-4 py-2 border-b text-[10px]">{orderDetails.reciever_address}</td>
                 </tr>
                            </tbody>
                            </div>
             </table>
           </div>
           
            ) : (
              <p>No details available for this order.</p>
            )}
            <button onClick={closeModal1} className="mt-4 bg-itccolor text-white py-2 hover:bg-orange-800 px-4 rounded">Close</button>
          </div>
        </div>
                        )}
                    </div>                 
                </div>
                
             

</div>




    <form onSubmit={handleFormSubmit} className="max-w-full mx-auto p-8 my-4 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold text-left mb-2">Create New Order</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sender Info Section */}
        <div>
          <h3 className="text-lg font-medium mb-4">Sender Info</h3>
          <input
            type="tel"
            placeholder="Phone"
            onChange={(e) => setFormData({ ...formData, sender_phone: e.target.value })}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setFormData({ ...formData, sender_email: e.target.value })}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Owner"
            onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Sender Address"
            onChange={(e) => setFormData({ ...formData, sender_address: e.target.value })}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

                {/* Receiver Info Section */}
        <div>
          <h3 className="text-lg font-medium mb-4">Receiver Info</h3>
          <input
            type="tel"
            placeholder="Phone"
            onChange={(e) => setFormData({ ...formData, reciever_phone: e.target.value })}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setFormData({ ...formData, reciever_email: e.target.value })}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Receiver Name"
            onChange={(e) => setFormData({ ...formData, reciever_name: e.target.value })}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Receiver Address"
            onChange={(e) => setFormData({ ...formData, reciever_address: e.target.value })}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

                {/* Logistic Info Section */}
                <div>
                    <h3 className="text-lg font-medium mb-4">Logistic Info</h3>

                    {/* Route Dropdown */}
                    {/* <select onChange={handleRouteChange} value={formData.route} className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg">
                        <option value="">Select Route</option>
                        {routes.map((route) => (
                            <option key={route._id} value={route._id}>
                                {route.startLocation} to {route.endLocation}
                            </option>
                        ))}
                    </select> */}
              
               {/* Route Dropdown */}
               {loading ? (
                    <p>Loading routes...</p>
                ) : (

                  <select
                  type="text"
                    onChange={(e) => {
                      const selectedOption = e.target.options[e.target.selectedIndex];
                      const transitroute = selectedOption.getAttribute('data-weight');
                    setFormData({
                      ...formData,
                      destination: e.target.value,
                      transitroute
                    });
                    handleRouteChange(e); // Call your existing handleRouteChange function
                  }}
                  value={formData.destination}
                  className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Route</option>
                  {routes.map((route) => (
                    <option key={route._id} value={route._id} data-weight={`${route.startLocation} - ${route.endLocation}`}>
                      {route.startLocation} to {route.endLocation}
                    </option>
                  ))}
                </select>
                  



                    // <select onChange={handleRouteChange} value={formData.destination} className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg">
                    //     <option value="">Select Route</option>
                    //     {routes.map((route) => (
                    //         <option key={route._id} value={route._id}>
                    //             {route.startLocation} to {route.endLocation}
                    //         </option>
                    //     ))}
                    // </select>
                )}

                    {/* Size Dropdown */}
                    {/* <select onChange={handleSizeChange} value={formData.size} className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg">
                        <option value="">Select Size</option>
                        {selectedRouteData?.size.map((size) => (
                            <option key={size._id} value={size._id}>
                                {size.weightKg} kg - ₦{size.amount}
                            </option>
                        ))}
                    </select> */}

                    {/* Goods Worth Dropdown */}
                    {/* <select onChange={handleGoodsworthChange} value={formData.goodsworth} className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg">
                        <option value="">Select Goods Worth</option>
                        {selectedRouteData?.goodsworth.map((worth) => (
                            <option key={worth._id} value={worth._id}>
                                {worth.grade} - ₦{worth.amount}
                            </option>
                        ))}
                    </select> */}

                    {/* Amount Input */}
                    {/* <input
                        type="text"
                        placeholder="Amount"
                        value={formData.amount}
                        readOnly
                        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
                    /> */}
              


              {/* Size Dropdown */}
              {selectedRouteData && selectedRouteData.logisticsDetail?.size ? (
                <select type="number" onChange={(e) => {
                  // Update both size ID and weight in the form data
      const selectedOption = e.target.options[e.target.selectedIndex];
      const sizeWeight = selectedOption.getAttribute('data-weight');
                  setFormData({ ...formData,    size: e.target.value, // Retains the size._id
                    sizeWeight,          // Stores the size weightKg
                  }); handleSizeChange(e);
                }} value={formData.size} className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg">
                        <option value="">Select Size</option>
                        {selectedRouteData.logisticsDetail.size.map((size) => (
                            <option key={size._id} value={size._id} data-weight={size.weightKg}>
                                {size.weightKg} kg - {size.amount} Naira
                            </option>
                        ))}
                    </select>
                ) : (
                    <p>Select a route to see size options.</p>
                )}

                {/* Goodsworth Dropdown */}
                {selectedRouteData && selectedRouteData.logisticsDetail?.goodsworth ? (
                <select type="text" onChange={(e) => {
                  const selectedOption2 = e.target.options[e.target.selectedIndex];
                  const goodGrade = selectedOption2.getAttribute('data-weight');
                  setFormData({
                    ...formData,
                    goodsworth: e.target.value,
                    goodGrade,
                  }); handleGoodsworthChange(e);
                }} value={formData.goodsworth} className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg">
                        <option value="">Select Goodsworth</option>
                        {selectedRouteData.logisticsDetail.goodsworth.map((good) => (
                            <option key={good._id} value={good._id} data-weight={good.grade}>
                                {good.grade} - {good.amount} Naira
                            </option>
                        ))}
                    </select>
                ) : (
                    <p>Select a route to see goodsworth options.</p>
              )}
              

            {/* Total Amount Display */}
            <div className="text-lg font-semibold text-left mt-4">
                Total Amount: {totalAmount} Naira
            </div>

                </div>
            </div>

           {/* Show the button only if all fields are filled */}
     {isFormComplete && (
        <button
          type="submit"
          className="w-full mt-8 py-3 bg-itccolor text-white font-semibold rounded-lg hover:bg-orange-800 transition duration-200"
        >
          Create Order
        </button>
      )}
        </form>


        



      






           

            










    {isOverviewVisible && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
    <div className="bg-white rounded-lg shadow-lg w-1/3">
      <div className="bg-itccolor">
        <h3 className="text-lg font-medium leading-6 text-gray-100 p-6">Order Overview</h3>
      </div>
      <div className="p-6">
      <table className="w-full text-left border-collapse">
    <thead>
      <tr className="border-b bg-gray-100">
        <th className="py-2 px-4 text-sm font-medium text-gray-600">Field</th>
        <th className="py-2 px-4 text-sm font-medium text-gray-600">Details</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b">
        <td className="py-3 px-4 text-gray-700 font-semibold">Grade</td>
        <td className="py-3 px-4 text-gray-800">{formData.goodGrade || "N/A"}</td>
                    </tr>
                    <tr className="border-b">
        <td className="py-3 px-4 text-gray-700 font-semibold">Goods Kg</td>
        <td className="py-3 px-4 text-gray-800">{formData.sizeWeight || "N/A"}</td>
      </tr>
      <tr className="border-b">
        <td className="py-3 px-4 text-gray-700 font-semibold">Destination</td>
        <td className="py-3 px-4 text-gray-800">{formData.transitroute || "N/A"}</td>
      </tr>
      <tr className="border-b">
        <td className="py-3 px-4 text-gray-700 font-semibold">Amount</td>
        <td className="py-3 px-4 text-gray-800">{formData.amount || "N/A"}</td>
      </tr>
      {/* Sender Information */}
      <tr className="border-b">
        <td className="py-3 px-4 text-gray-700 font-semibold">Sender Phone</td>
        <td className="py-3 px-4 text-gray-800">{formData.sender_phone || "N/A"}</td>
      </tr>
      <tr className="border-b">
        <td className="py-3 px-4 text-gray-700 font-semibold">Sender Email</td>
        <td className="py-3 px-4 text-gray-800">{formData.sender_email || "N/A"}</td>
      </tr>
      <tr className="border-b">
        <td className="py-3 px-4 text-gray-700 font-semibold">Sender Name</td>
        <td className="py-3 px-4 text-gray-800">{formData.sender_name || "N/A"}</td>
      </tr>
      <tr className="border-b">
        <td className="py-3 px-4 text-gray-700 font-semibold">Sender Address</td>
        <td className="py-3 px-4 text-gray-800">{formData.sender_address || "N/A"}</td>
      </tr>
      {/* Receiver Information */}
      <tr className="border-b">
        <td className="py-3 px-4 text-gray-700 font-semibold">Receiver Phone</td>
        <td className="py-3 px-4 text-gray-800">{formData.reciever_phone || "N/A"}</td>
      </tr>
      <tr className="border-b">
        <td className="py-3 px-4 text-gray-700 font-semibold">Receiver Email</td>
        <td className="py-3 px-4 text-gray-800">{formData.reciever_email || "N/A"}</td>
      </tr>
      <tr className="border-b">
        <td className="py-3 px-4 text-gray-700 font-semibold">Receiver Name</td>
        <td className="py-3 px-4 text-gray-800">{formData.reciever_name || "N/A"}</td>
      </tr>
      <tr className="border-b">
        <td className="py-3 px-4 text-gray-700 font-semibold">Receiver Address</td>
        <td className="py-3 px-4 text-gray-800">{formData.reciever_address || "N/A"}</td>
      </tr>
    </tbody>
  </table>
        
        <FlutterWaveButton {...paymentConfig} className='bg-itccolor text-white text-md m-4 p-2 w-full rounded-md' text="Proceed to Payment" />     
        <div className="flex w-full justify-end space-x-2 mt-4">
          <button
            type="button"
            onClick={() => setIsOverviewVisible(false)}
            className="bg-gray-500 text-white px-4 py-2 w-full rounded-md hover:bg-gray-600 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}


        {paymentSuccess &&  (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="p-6 bg-white rounded-lg shadow-md w-96">
             
          
              
              <div id="order-summary" className="mt-4">
                <div className='bg-itccolor p-2 w-full'>
                  <h2 className="text-xl text-white font-semibold mb-4">Order Created</h2>
                  </div>
                <p className="text-green-500 mb-4">Order Summary Message:{successData.message}</p>
                <p className="font-semibold text-gray-500">Tracking Code: {successData.trackingCode}</p>
                <p className="text-gray-500 font-semibold mb-4">Sender Phone:{successData.sender_phone}</p>
                <p className="font-semibold text-gray-500 mb-4">Reciever Phone: {successData.reciever_phone}</p>
                <p className="text-gray-500 font-semibold mb-4">Sender Name:{successData.sender_name}</p>
                </div>
            
          
             
          
              <div className="mt-4">
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-itccolor text-white w-full rounded-md hover:bg-orange-700"
                >
                  Download Summary
                </button>
               
              </div>
            </div>
          </div>
        )
        };      


      <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Order List</h2>
      {deleteStatus && <p className="text-red-500 mb-4">{deleteStatus}</p>}

      <div>
      {/* Date Filter Input */}
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
            {/* Table headers */}
            <th className="px-4 text-[10px] py-2 border-b">Order Destination</th>
            <th className="px-4 text-[10px] py-2 border-b">Size</th>
            <th className="px-4 text-[10px] py-2 border-b">Code</th>
            <th className="px-4 text-[10px] py-2 border-b">Sender</th>
            <th className="px-4 text-[10px] py-2 border-b">Receiver</th>
            <th className="px-4 text-[10px] py-2 border-b">Status</th>
            <th className="px-4 text-[10px] py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
        {filteredOrders.map((order) => (
  <tr key={order._id} className="hover:bg-gray-100 transition duration-150">
    <td className="px-4 text-[10px] py-2 border-b">{order.destination}</td>
    <td className="px-4 text-[10px] py-2 border-b">{order.size}</td>
    <td className="px-4 text-[10px] py-2 border-b">{order.trackingCode}</td>
    <td className="px-4 text-[10px] py-2 border-b">{order.sender_name}</td>
    <td className="px-4 text-[10px] py-2 border-b">{order.receiver_name}</td>
    <td className="px-4 text-[10px] py-2 border-b">{order.status}</td>
    <td className="px-4 text-[10px] py-2 border-b">
      <button
        onClick={() => handleViewDetails(order)}
        className="text-blue-600 hover:text-blue-800 transition duration-150 mr-2"
      >
        View Details
      </button>
      
      {/* Conditionally render the Delete button only if the status is not "Delivered" */}
      {order.status !== 'Delivered' && (
        <button
          onClick={() => handleDelete(order._id)}
          className="text-red-600 hover:text-red-800 transition duration-150"
        >
          Delete
        </button>
      )}
    </td>
  </tr>
))}

        </tbody>
      </table>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4 w-11/12 md:w-1/3">
            <h2 className="text-lg font-bold mb-2">Order Details</h2>
            {selectedOrder && (
              <div>
                <p><strong>Order Destination:</strong> {selectedOrder.destination}</p>
                <p><strong>Size:</strong> {selectedOrder.size}</p>
                <p><strong>Code:</strong> {selectedOrder.trackingCode}</p>
                <p><strong>Sender:</strong> {selectedOrder.sender_name}</p>
                <p><strong>Sender Phone:</strong> {selectedOrder.sender_phone}</p>
                <p><strong>Sender Email:</strong> {selectedOrder.sender_email}</p>
                <p><strong>Sender Address:</strong> {selectedOrder.sender_address}</p>
                <p><strong>Receiver:</strong> {selectedOrder.receiver_name}</p>
                <p><strong>Receiver Phone:</strong> {selectedOrder.receiver_phone}</p>
                <p><strong>Receiver Email:</strong> {selectedOrder.receiver_email}</p>
                <p><strong>Receiver Address:</strong> {selectedOrder.receiver_address}</p>
                <p><strong>Status:</strong> {selectedOrder.status}</p>
              </div>
            )}
            <button onClick={closeModal} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Close</button>
          </div>
        </div>
      )}
    </div>
    </div>
      </>
  
  );
};

export default OrderForm;




