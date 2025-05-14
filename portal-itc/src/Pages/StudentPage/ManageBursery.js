// import React, { useState, useEffect, useContext } from 'react';
// import AuthContext from '../../context/AuthContext';
// import paymentService from '../../services/Paymentservices';
// import { getStudentById } from '../../services/studentService';

// // import { useSelector } from 'react-redux';
// const StudentPayments = () => {
//   const [paymentsDue, setPaymentsDue] = useState([]);
//   const [selectedPayments, setSelectedPayments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [processing, setProcessing] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const { user } = useContext(AuthContext);
//   // const { userInfo } = useSelector(state => state.auth);

//   console.log('we bwe',user)
//   useEffect(() => {
//     const fetchPaymentsDue = async () => {
//       try {
//         setLoading(true);
//         const studentData = await getStudentById(user._id);
//         console.log('rtr', studentData.data.class)
//         const data = await paymentService.getStudentPaymentsDue(studentData.data.class);
//         setPaymentsDue(data);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchPaymentsDue();
//   }, [user._id]);

//   const handleCheckboxChange = (paymentTypeId, isChecked) => {
//     if (isChecked) {
//       setSelectedPayments([...selectedPayments, paymentTypeId]);
//     } else {
//       setSelectedPayments(selectedPayments.filter(id => id !== paymentTypeId));
//     }
//   };

//   const calculateTotal = () => {
//     return paymentsDue
//       .filter(pt => selectedPayments.includes(pt._id))
//       .reduce((sum, pt) => sum + pt.amount, 0);
//   };

//   const handlePayment = async () => {
//     try {
//       setProcessing(true);
//       setError('');
//       setSuccess('');

//       const paymentData = await paymentService.initiatePayment(selectedPayments, user._id);

//       // Redirect to OPay payment page
//       window.location.href = paymentData.paymentUrl;
//     } catch (err) {
//       setError(err.message);
//       setProcessing(false);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-3xl font-semibold mb-6">My Payments</h2>

//       {error && <div className="text-red-500 mb-4">{error}</div>}
//       {success && <div className="text-green-500 mb-4">{success}</div>}

//       <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-xl font-medium">Payment Summary</h3>
//         </div>
//         <p className="text-lg">
//           Total Selected: {selectedPayments.length} | Total Amount: {calculateTotal().toLocaleString()}
//         </p>
//         <button
//           className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition duration-300"
//           onClick={handlePayment}
//           disabled={selectedPayments.length === 0 || processing}
//         >
//           {processing ? (
//             <div className="flex items-center space-x-2">
//               <div className="animate-spin border-t-2 border-white w-4 h-4 rounded-full border-t-transparent"></div>
//               <span>Processing...</span>
//             </div>
//           ) : (
//             'Proceed to Payment'
//           )}
//         </button>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center space-x-2">
//           <div className="animate-spin border-t-2 border-blue-600 w-8 h-8 rounded-full border-t-transparent"></div>
//           <span className="text-lg">Loading...</span>
//         </div>
//       ) : (
//         <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
//           <table className="min-w-full table-auto">
//             <thead>
//               <tr>
//                 <th className="px-4 py-2 text-left">Select</th>
//                 <th className="px-4 py-2 text-left">Payment Type</th>
//                 <th className="px-4 py-2 text-left">Description</th>
//                 <th className="px-4 py-2 text-left">Amount</th>
//                 <th className="px-4 py-2 text-left">Due Date</th>
//                 <th className="px-4 py-2 text-left">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {paymentsDue.length > 0 ? (
//                 paymentsDue.map(payment => (
//                   <tr key={payment._id} className="border-t hover:bg-gray-100">
//                     <td className="px-4 py-2">
//                       <input
//                         type="checkbox"
//                         checked={selectedPayments.includes(payment._id)}
//                         onChange={(e) => handleCheckboxChange(payment._id, e.target.checked)}
//                         className="h-4 w-4"
//                       />
//                     </td>
//                     <td className="px-4 py-2">{payment.name}</td>
//                     <td className="px-4 py-2">{payment.description}</td>
//                     <td className="px-4 py-2">{payment.amount.toLocaleString()}</td>
//                     <td className="px-4 py-2">{new Date(payment.dueDate).toLocaleDateString()}</td>
//                     <td className="px-4 py-2">Unpaid</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="text-center py-4">No payments due</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StudentPayments;


import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import paymentService from '../../services/Paymentservices';
import { getStudentById } from '../../services/studentService';

const StudentPayments = () => {
  const [paymentsDue, setPaymentsDue] = useState([]);
  const [paidPayments, setPaidPayments] = useState([]);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const studentData = await getStudentById(user._id);
        const due = await paymentService.getStudentPaymentsDue(studentData.data.class);
        const paid = await paymentService.getStudentPaidPayments(user._id);
        setPaymentsDue(due);
        setPaidPayments(paid);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user._id]);

  const handleCheckboxChange = (paymentTypeId, isChecked) => {
    if (isChecked) {
      setSelectedPayments([...selectedPayments, paymentTypeId]);
    } else {
      setSelectedPayments(selectedPayments.filter(id => id !== paymentTypeId));
    }
  };

  const calculateTotal = () => {
    return paymentsDue
      .filter(pt => selectedPayments.includes(pt._id))
      .reduce((sum, pt) => sum + pt.amount, 0);
  };

  const handlePayment = async () => {
    try {
      setProcessing(true);
      setError('');
      setSuccess('');
      const paymentData = await paymentService.initiatePayment(selectedPayments, user._id);
      window.location.href = paymentData.paymentUrl;
    } catch (err) {
      setError(err.message);
      setProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">My Payments</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <p className="text-sm">
          Total Selected: {selectedPayments.length} | Total Amount: ₦{calculateTotal().toLocaleString()}
        </p>
        <button
          className="mt-2 bg-itccolor text-sm text-white px-6 py-2 rounded-lg hover:bg-orange-700 disabled:bg-gray-400"
          onClick={handlePayment}
          disabled={selectedPayments.length === 0 || processing}
        >
          {processing ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {paymentsDue.map((payment, index) => {
  const paid = Array.isArray(paidPayments) && paidPayments.some(p => p.paymentType === payment._id);

  return (
    <div key={payment._id}>
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col space-y-4 border">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <p className="font-semibold text-lg">{payment.name}</p>
          <input
            type="checkbox"
            disabled={paid}
            checked={selectedPayments.includes(payment._id)}
            onChange={(e) => handleCheckboxChange(payment._id, e.target.checked)}
            className="h-5 w-5"
          />
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600">{payment.description}</p>

        {/* Justified Info Rows */}
        <div className="flex justify-between text-sm border-b border-dotted border-gray-700">
          <span className="font-semibold">Amount:</span>
          <span>₦{payment.amount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm border-b border-dotted border-gray-700">
          <span className="font-semibold">Due Date:</span>
          <span>{new Date(payment.dueDate).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between text-sm border-b border-dotted border-gray-700">
          <span className="font-semibold">Status:</span>
          <span className={paid ? 'text-green-600' : 'text-red-600'}>
            {paid ? 'Paid' : 'Unpaid'}
          </span>
        </div>
      </div>

      {/* Dotted divider (exclude after last item) */}
      {index !== paymentsDue.length - 1 && (
        <div className="border-b border-dotted border-gray-300 my-4"></div>
      )}
    </div>
  );
})}

        </div>
      )}
    </div>
  );
};

export default StudentPayments;

