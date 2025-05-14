import axios from 'axios';

// const TILL_BOOKING_API_URL = process.env.REACT_APP_BOOKING_API_URL;

export const getRouteProfile = async () => {
  try {
    const response = await axios.get(`/booking/api/cars/`);
    // const response = await axios.get(`${TILL_BOOKING_AP_IURL}/api/cars/`);

    return response.data;
  } catch (error) {
    console.error('Error fetching route profile:', error);
    throw error; // Throw to allow higher-level error handling if needed
  }
};

export const updateCarProfile = async (Id, completeCarDataupdate) => {
  try {
    // const response = await axios.put(`${TILL_BOOKING_API_URL}/api/cars/${Id}`, completeCarDataupdate);
    const response = await axios.put(`/booking/api/cars/${Id}`, completeCarDataupdate);

    return response.data;
  } catch (error) {
    console.error('Error updating cars profile:', error);
    throw error;
  }
};


export const addCar = async (completeCarData) => {
  try {
    const response = await axios.post(`/booking/api/cars/`, completeCarData);
    // const response = await axios.post(`${TILL_BOOKING_API_URL}/api/cars/`, completeCarData);

    return response.data;
  } catch (error) {
    console.error('Error creating car profile:', error);
    throw error;
  }
};

export const getAllCarsByRegistered = async (Ref) => {
  try {
    const response = await axios.get(`/booking/api/cars/registered/${Ref}`);
    // const response = await axios.get(`${TILL_BOOKING_API_URL}/api/cars/registered/${Ref}`);

    return response.data;
  } catch (error) {
    console.error('Error fetching all car:', error);
    throw error;
  }
};



export const getAllCars = async () => {
  try {
    const response = await axios.get(`/booking/api/cars/`);
    // const response = await axios.get(`${TILL_BOOKING_API_URL}/api/cars/`);

    return response.data;
  } catch (error) {
    console.error('Error fetching all car:', error);
    throw error;
  }
};


export const deleteCar = async (routeId) => {
  try {
    // const response = await axios.delete(`${TILL_BOOKING_API_URL}/api/cars/${routeId}`);
    const response = await axios.delete(`/booking/api/cars/${routeId}`);

    return response.data;
  } catch (error) {
    console.error('Error deleting cars:', error);
    throw error;
  }
};
