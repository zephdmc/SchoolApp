import axios from 'axios';


export const FailedBooking = async (Booked) => {
  try {
    // const response = await axios.post(`${TILL_BOOKING_API_URL}/api/FaildBooking/`, Booked);

    const response = await axios.post(`/api/FaildBooking/`, Booked);
    return response.data;
  } catch (error) {
    console.error('Error creating Booking profile:', error);
    throw error;
  }
};






