import React, { useState, useEffect, useRef, useContext } from 'react';
import LocationBookingBarChart from './Barchart1'; // Adjust the path as necessary
import { getAllBooking } from '../../services/ClassService'; // Import your service
import AuthContext from '../../context/AuthContext';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { getAllUsers} from '../../services/userService';


const Overview = () => {
  const [bookings, setBookings] = useState([]);
  const { user } = useContext(AuthContext);
  const [weeklyBookings, setWeeklyBookings] = useState(0);
  const [monthlyBookings, setMonthlyBookings] = useState(0);
  const [totalAmountBooked, setTotalAmountBooked] = useState(0);
  const [monthlyAmountBooked, setMonthlyAmountBooked] = useState(0);
  const [monthlyEarningsData, setMonthlyEarningsData] = useState({
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
      },
    ],
  });
  const [staff, setStsff] = useState([]);
  const [totalStaff1, setTotalStaff] = useState(0); // Initialize as a number
  


  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getAllBooking();
          setBookings(data);
        const fetchedBookings = data; // Assuming bookings are in response.data

   
        
        // Get total bookings of the week
        const bookingsThisWeek = fetchedBookings.filter(booking =>
          isThisWeek(new Date(booking.createdAt))
        );
        // Get total bookings of the month
        const bookingsThisMonth = fetchedBookings.filter(booking =>
          isThisMonth(new Date(booking.created_at))
        );

        const totalAmount = fetchedBookings.reduce((sum, booking) => sum + booking.charged_amount, 0);
        
        // Calculate total amount booked for the month
        const totalAmountThisMonth = bookingsThisMonth.reduce((sum, booking) => sum + booking.charged_amount, 0);

        const totalStaff = staff.length; // This is correct
        setTotalStaff(totalStaff); // Use this to set the total staff
        
        const pieData = generatePieChartData(fetchedBookings);

        // Set the counts
        setMonthlyEarningsData(pieData);
        setWeeklyBookings(bookingsThisWeek.length);
        setMonthlyBookings(bookingsThisMonth.length);
        setTotalAmountBooked(totalAmount);
        setMonthlyAmountBooked(totalAmountThisMonth);

        // setBookings(fetchedBookings); // Update the main state
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };
    fetchBookings();
  }, [user.token]);



  useEffect(() => {
    const fetchBookings = async () => {
      try {
       

        const users = await getAllUsers(user.token);
        setStsff(users);
      // const users1 = users; // Assuming bookings are in response.dat
        const totalStaff = users.length; // This is correct
        setTotalStaff(totalStaff); // Use this to set the total staff
       
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };
    fetchBookings();
  }, [user.token]);


  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const data = await getAllUsers(user.token);
  //       setStsff(data);
  //     } catch (error) {
  //       console.error('Failed to fetch users:', error);
  //     }
  //   };
  //   fetchUsers();
  // }, [user.token]);


  const isThisWeek = (date) => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() + (6 - today.getDay())));
    return date >= startOfWeek && date <= endOfWeek;
  };


 const isThisMonth = (date) => {
    const today = new Date();
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };


  
  // Helper function to get the month from a date
  const getMonth = (date) => new Date(date).getMonth();

  // Helper function to get the year from a date
  const getYear = (date) => new Date(date).getFullYear();

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
  




  return (
    <div className="p-2 w-full md:p-6">
    <h2 className="text-xl font-bold mb-6">Overview</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 h-[30%] gap-2 md:gap-6">
      <div className="bg-gray-100 p-2 md:p-6 rounded-lg shadow-md ">
        {/* Other sections of the overview */}
        <LocationBookingBarChart bookings={bookings} />
  
        <div className="mt-6">
          {/* Total amount booked */}
          <div className="bg-white p-2 md:p-6 rounded-lg shadow-md mb-4">
            <h3 className="text-lg text-gray-500 font-semibold mb-2">Total Amount Booked</h3>
            <p className="text-sm md:text-4xl text-itccolor font-bold">₦{totalAmountBooked.toLocaleString()}</p>
          </div>
  
          {/* Total amount booked for the month */}
          <div className="bg-white p-2 md:p-6 rounded-lg shadow-md mb-4">
            <h3 className="text-lg text-gray-500 font-semibold mb-2">Total Amount Booked for the Month</h3>
            <p className="text-sm md:text-4xl text-itccolor font-bold">₦{monthlyAmountBooked.toLocaleString()}</p>
            </div>
            
             {/* Total Staff  */}
          <div className="bg-white p-2 md:p-6 rounded-lg shadow-md mb-4">
            <h3 className="text-lg font-semibold text-gray-500 mb-2">Total Staff</h3>
              <p className="text-sm md:text-4xl text-itccolor font-bold">{ totalStaff1}</p>
            </div>
            
        </div>
      </div>
  
      <div className="bg-gray-100 p-2 md:p-6 rounded-lg shadow-md">
        <h2 className="text-2xl text-gray-500 font-bold mb-4">Booking Overview</h2>
  
        {/* Total bookings for the week */}
        <div className="bg-white p-2 md:p-6 rounded-lg shadow-md mb-4">
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Weekly Bookings</h3>
          <p className="text-4xl text-itccolor font-bold">{weeklyBookings}</p>
        </div>
  
        {/* Total bookings for the month */}
        <div className="bg-white p-2 md:p-6 rounded-lg shadow-md mb-4">
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Monthly Bookings</h3>
          <p className="text-4xl text-itccolor font-bold">{monthlyBookings}</p>
        </div>
  
        {/* Monthly Earnings Pie Chart */}
        {monthlyEarningsData.datasets && monthlyEarningsData.datasets.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-4">
            <h3 className="text-md md:text-lg  text-gray-500 font-semibold mb-2">Monthly Earnings Distribution</h3>
            <Pie data={monthlyEarningsData} />
          </div>
        )}
      </div>
    </div>
  </div>
  
  )
};


export default Overview;



// import React, { useState, useEffect, useContext } from 'react';
// import LocationBookingBarChart from './Barchart'; // Adjust the path as necessary
// import { getAllBooking } from '../../services/bookingService'; // Import your service
// import AuthContext from '../../context/AuthContext';

// const Overview = () => {
//   const [bookings, setBookings] = useState([]);
//   const { user } = useContext(AuthContext);
//   const [weeklyBookings, setWeeklyBookings] = useState(0);
//   const [monthlyBookings, setMonthlyBookings] = useState(0);

//   // Helper function to check if a date is within this week
//   const isThisWeek = (date) => {
//     const today = new Date();
//     const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
//     const endOfWeek = new Date(today.setDate(today.getDate() + (6 - today.getDay())));

//     return date >= startOfWeek && date <= endOfWeek;
//   };

//   // Helper function to check if a date is within this month
//   const isThisMonth = (date) => {
//     const today = new Date();
//     return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
//   };

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const data = await getAllBooking();
//         const fetchedBookings = data.data; // Assuming bookings are in response.data

//         // Filter total bookings of the week
//         const bookingsThisWeek = fetchedBookings.filter(booking =>
//           isThisWeek(new Date(booking.created_at))
//         );

//         // Filter total bookings of the month
//         const bookingsThisMonth = fetchedBookings.filter(booking =>
//           isThisMonth(new Date(booking.created_at))
//         );

//         // Set the counts
//         setWeeklyBookings(bookingsThisWeek.length);
//         setMonthlyBookings(bookingsThisMonth.length);
//         setBookings(fetchedBookings); // Update the main state
//       } catch (error) {
//         console.error('Failed to fetch bookings:', error);
//       }
//     };
//     fetchBookings();
//   }, [user.token]);

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold">Overview</h2>
//       <p>Dashboard overview content goes here.</p>
//       <div className="flex">
//         <div className="">
//           {/* Bar chart section */}
//           <LocationBookingBarChart bookings={bookings} />
//         </div>
//         <div className="ml-6">
//           <div className="p-6 bg-gray-100">
//             <h2 className="text-2xl font-bold mb-4">Booking Overview</h2>

//             {/* Total bookings for the week */}
//             <div className="bg-white p-4 rounded-lg shadow-md mb-4">
//               <h3 className="text-lg font-semibold mb-2">Total Bookings This Week</h3>
//               <p className="text-4xl text-blue-600 font-bold">{weeklyBookings}</p>
//             </div>

//             {/* Total bookings for the month */}
//             <div className="bg-white p-4 rounded-lg shadow-md mb-4">
//               <h3 className="text-lg font-semibold mb-2">Total Bookings This Month</h3>
//               <p className="text-4xl text-green-600 font-bold">{monthlyBookings}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Overview;
