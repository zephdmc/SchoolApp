// import React from 'react';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// // Register the necessary components for Chart.js
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const LocationBookingBarChart = ({ bookings }) => {

//     console.log(bookings); // Check if bookings contains the expected data

//     // Check if bookings is an array; if not, provide an empty array as a fallback
//     const isBookingsArray = Array.isArray(bookings);
    
//     // Aggregate bookings by start and end location
//     const bookingCounts = {};
    
//     if (isBookingsArray) {
//       bookings.forEach((booking) => {
//         const key = `${booking.startLocation} to ${booking.endLocation}`;
//         if (bookingCounts[key]) {
//           bookingCounts[key] += 1;
//         } else {
//           bookingCounts[key] = 1;
//         }
//       });
//     }
  

//   // Prepare data for the chart
//   const labels = Object.keys(bookingCounts);
//   const data = Object.values(bookingCounts);

//   const chartData = {
//     labels: labels, // Start-End locations as labels
//     datasets: [
//       {
//         label: 'Number of Bookings',
//         data: data,
//         backgroundColor: 'rgb(101, 22, 41)', // Bar color
//         borderColor: 'rgba(75, 192, 192, 1)', // Border color
//         borderWidth: 1,
//       },
//     ],
//   };

    
    
//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       title: {
//         display: true,
//         text: 'Bookings by Start and End Location',
//       },
//     },
//   };

//   return (
//     <div className="my-8">
//       <Bar data={chartData} options={chartOptions} />
//     </div>
//   );
// };

// export default LocationBookingBarChart;


import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const LocationBookingBarChart = ({ bookings }) => {
  // Check if bookings is an array; if not, provide an empty array as a fallback
  const isBookingsArray = Array.isArray(bookings);
  
  // Aggregate bookings by start and end location
  const bookingCounts = {};
  
  if (isBookingsArray) {
    bookings.forEach((booking) => {
      const key = `${booking.startLocation} to ${booking.endLocation}`;
      if (bookingCounts[key]) {
        bookingCounts[key] += 1;
      } else {
        bookingCounts[key] = 1;
      }
    });
  }

  // Calculate total bookings
  const totalBookings = Object.values(bookingCounts).reduce((sum, count) => sum + count, 0);

  // Prepare data for the chart with percentages
  const labels = Object.keys(bookingCounts);
  const data = totalBookings > 0 ? Object.values(bookingCounts).map(count => (count / totalBookings) * 100) : [];

  const chartData = {
    labels: labels, // Start-End locations as labels
    datasets: [
      {
        label: 'Percentage of Bookings',
        data: data,
        backgroundColor: 'rgb(101, 22, 41)', // Bar color
        borderColor: 'rgba(75, 192, 192, 1)', // Border color
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Bookings by Start and End Location (Percentage)',
      },
    },
  };

  return (
    <div className="my-8">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default LocationBookingBarChart;
