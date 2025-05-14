import axios from 'axios';


export const createOrder = async (orderData, token) => {
  const response = await axios.post('/logistics/api/logistics/create', orderData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
export const trackOrder = async (trackingCode) => {
  const response = await axios.get(`/logistics/api/logistics/track/${trackingCode}`);
  return response.data;
};


export const confirmLocation = async (trackingCode, location) => {
    const response = await axios.put(`/logistics/api/logistics/confirm-location`, { trackingCode, location },
    );
  return response.data;
};

export const fetchOrdersById = async (userId, token) => {
  const response = await axios.get(`/logistics/api/logistics/ordersByUser/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteOrder = async (orderId, token) => {
  const response = await axios.delete(`/logistics/api/logistics/deleteOrder/${orderId}`, {
    headers:{ Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const UpdateStatus = async (trackingCode1) => {
    const response = await axios.put('/logistics/api/logistics/update-status', {trackingCode1});
    return response.data;
  };
  
export const fetchAllOrders = async () => {
    const response = await axios.get('/logistics/api/logistics',);
    return response.data;
  };


  export const getMonthlyLogistics = async () => {
    const response = await axios.get(`/logistics/api/logistics/monthlyLog`);
    return response.data;
}
    ; export const getYearlyLogistics = async (userId, token) => {
    const response = await axios.get(`/logistics/api/logistics/yearlyLog`);
    return response.data;
};
export const getTopLocation = async (userId, token) => {
    const response = await axios.get(`/logistics/api/logistics/topLocation`
    );
    return response.data;
  };

// axios.put('/api/orders/update-status', { trackingCode });
// Fetch all routes
export const fetchRoutes = async () => {
    try {
        const response = await axios.get(`/logistics/api/logisticsOrder`);
        console.log(response)
      return response.data;
    } catch (error) {
      console.error('Error fetching routes:', error);
      throw error;  // Rethrow the error to handle it in the calling function
    }
  };
  
  // Add a new route
  export const addRoute = async (routeData) => {
    try {
      const response = await axios.post(`/logistics/api/logisticsOrder/create`, routeData);
      return response.data;
    } catch (error) {
      console.error('Error adding route:', error);
      throw error;
    }
  };
  
  // Update a route by ID
  export const updateRoute = async (id, updatedData) => {
    try {
      const response = await axios.put(`/logistics/api/logisticsOrder/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error('Error updating route:', error);
      throw error;
    }
  };
  
  // Delete a route by ID
  export const deleteRoute = async (id) => {
    try {
      const response = await axios.delete(`/logistics/api/logisticsOrder/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting route:', error);
      throw error;
    }
  };



  // Add size detail to a route
export const addSizeDetail = async (routeId, sizeData) => {
    try {
      const response = await axios.post(`/logistics/api/logisticsOrder/${routeId}/size`, sizeData);
      return response.data; // Return the response data
    } catch (error) {
      console.error('Error adding size detail:', error); // Log error
      throw error; // Rethrow the error for further handling
    }
  };
  
  // Add goods worth detail to a route
  export const addGoodsWorthDetail = async (routeId, goodsworthData) => {
    try {
      const response = await axios.post(`/logistics/api/logisticsOrder/${routeId}/goodsworth`, goodsworthData);
      return response.data; // Return the response data
    } catch (error) {
      console.error('Error adding goods worth detail:', error); // Log error
      throw error; // Rethrow the error for further handling
    }
  };
  

    // Update a route by ID
    export const DeleteSize = async (routeId, index) => {
        try {
          const response = await axios.put(`/logistics/api/logisticsOrder/${routeId}/size/${index}/delete`);
          return response;
        } catch (error) {
          console.error('Error updating route:', error);
          throw error;
        }
};
// Update a route by ID
      export const DeleteGoodsWorth  = async (routeId, index) => {
        try {
          const response = await axios.put(`/logistics/api/logisticsOrder/${routeId}/goodsworth/${index}/delete`);
          return response;
        } catch (error) {
          console.error('Error updating route:', error);
          throw error;
        }
      };
//   // Add size detail to a route
//   export const addSizeDetail = async (routeId, sizeData) => {
//     try {
//       const response = await axios.post(`/logistics/api/logisticsOrder/${routeId}/size`, sizeData);
//       return response.data;
//     } catch (error) {
//       console.error('Error adding size detail:', error);
//       throw error;
//     }
//   };
  
//   // Add goods worth detail to a route
//   export const addGoodsWorthDetail = async (routeId, goodsworthData) => {
//     try {
//       const response = await axios.post(`/logistics/api/logisticsOrder/${routeId}/goodsworth`, goodsworthData);
//       return response.data;
//     } catch (error) {
//       console.error('Error adding goods worth detail:', error);
//       throw error;
//     }
//   };



  





  

// export const fetchRoutes = async () => {
//     const response = await axios.get('/logistics/api/logisticsOrder/');
//     return response.data;
//     // return await response.json(); // Ensure the response is JSON
// };

// export const addRoute = async (routeData) => {
//   const response = await axios.post('/logistics/api/logisticsOrder/create', routeData);
//   return response.data;
// };

// export const updateRoute = async (id, updatedData) => {
//   const response = await axios.put(`/logistics/api/logisticsOrder/${id}`, updatedData);
//   return response.data;
// };

// export const deleteRoute = async (id) => {
//   const response = await axios.delete(`/logistics/api/logisticsOrder/${id}`);
//   return response.data;
// };
