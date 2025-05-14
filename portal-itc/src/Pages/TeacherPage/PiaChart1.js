import React, { useState, useEffect, useContext } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import LocationBookingBarChart from './Barchart'; // Adjust the path as necessary
import { getAllBooking } from '../../services/bookingService'; // Import your service
import AuthContext from '../../context/AuthContext';

const Overview = () => {
  const [bookings, setBookings] = useState([]);
  const { user } = useContext(AuthContext);
  const [weeklyBookings, setWeeklyBookings] = useState(0);
  const [monthlyBookings, setMonthlyBookings] = useState(0);
  const [totalAmountBooked, setTotalAmountBooked] = useState(0);
  const [monthlyAmountBooked, setMonthlyAmountBooked] = useState(0);
  const [monthlyEarningsData, setMonthlyEarningsData] = useState({});

  // Helper function to check if a date is in the current month
  const isThisMonth = (date) => {
    const today = new Date();
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };

  // Helper function to get the month from a date
  const getMonth = (date) => new Date(date).getMonth();

  // Helper function to get the year from a date
  const getYear = (date) => new Date(date).getFullYear();

  // Function to generate pie chart data
  const generatePieChartData = (bookings) => {
    const currentYear = new Date().getFullYear();
    const monthlyTotals = new Array(12).fill(0);

    // Accumulate the totals for each month of the current year
    bookings.forEach((booking) => {
      const bookingDate = new Date(booking.created_at);
      if (getYear(bookingDate) === currentYear) {
        const monthIndex = getMonth(bookingDate);
        monthlyTotals[monthIndex] += booking.charged_amount;
      }
    });

    const monthLabels = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 
      'August', 'September', 'October', 'November', 'December'
    ];

    return {
      labels: monthLabels,
      datasets: [
        {
          label: `Monthly Earnings for ${currentYear}`,
          data: monthlyTotals,
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
            '#FF9F40', '#F7464A', '#46BFBD', '#FDB45C', '#949FB1', 
            '#4D5360', '#AC64AD'
          ],
          hoverBackgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
            '#FF9F40', '#F7464A', '#46BFBD', '#FDB45C', '#949FB1', 
            '#4D5360', '#AC64AD'
          ],
        },
      ],
    };
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getAllBooking();
        const fetchedBookings = data.data; // Assuming bookings are in response.data
        setBookings(fetchedBookings);

        // Calculate total amount booked
        const totalAmount = fetchedBookings.reduce((sum, booking) => sum + booking.charged_amount, 0);
        
        // Filter bookings for the current month
        const bookingsThisMonth = fetchedBookings.filter(booking =>
          isThisMonth(new Date(booking.created_at))
        );

        // Calculate total amount booked for the month
        const totalAmountThisMonth = bookingsThisMonth.reduce((sum, booking) => sum + booking.charged_amount, 0);

        // Generate pie chart data
        const pieData = generatePieChartData(fetchedBookings);

        // Update state
        setMonthlyBookings(bookingsThisMonth.length);
        setTotalAmountBooked(totalAmount);
        setMonthlyAmountBooked(totalAmountThisMonth);
        setMonthlyEarningsData(pieData);

      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };

    fetchBookings();
  }, [user.token]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Overview</h2>
      <div className="flex">
        <div className="">
          {/* Booking Bar Chart */}
          <LocationBookingBarChart bookings={bookings} />
        </div>
        <div className="p-6 bg-gray-100">
          <h2 className="text-2xl font-bold mb-4">Booking Overview</h2>

          {/* Total bookings for the week */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-4">
            <h3 className="text-lg font-semibold mb-2">Weekly Bookings</h3>
            <p className="text-4xl text-itccolor font-bold">{weeklyBookings}</p>
          </div>

          {/* Total bookings for the month */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-4">
            <h3 className="text-lg font-semibold mb-2">Month Bookings</h3>
            <p className="text-4xl text-itccolor font-bold">{monthlyBookings}</p>
          </div>

          {/* Total amount booked */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-4">
            <h3 className="text-lg font-semibold mb-2">Total Amount Booked</h3>
            <p className="text-4xl text-itccolor font-bold">₦{totalAmountBooked.toLocaleString()}</p>
          </div>

          {/* Total amount booked for the month */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-4">
            <h3 className="text-lg font-semibold mb-2">Total Amount Booked for the Month</h3>
            <p className="text-4xl text-itccolor font-bold">₦{monthlyAmountBooked.toLocaleString()}</p>
          </div>

          {/* Monthly Earnings Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-4">
            <h3 className="text-lg font-semibold mb-2">Monthly Earnings Distribution</h3>
            <Pie data={monthlyEarningsData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
