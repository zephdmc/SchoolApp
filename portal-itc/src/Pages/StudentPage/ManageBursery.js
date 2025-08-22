
// import React, { useState, useEffect, useContext } from 'react';
// import AuthContext from '../../context/AuthContext';
// import paymentService from '../../services/Paymentservices';
// import { getStudentById } from '../../services/studentService';
// import axios from 'axios';

// const StudentPayments = () => {
//   const [paymentsDue, setPaymentsDue] = useState([]);
//   const [outstandingPayments, setOutstandingPayments] = useState([]);
//   const [paidPayments, setPaidPayments] = useState([]);
//   const [selectedPayments, setSelectedPayments] = useState([]);
//   const [student, setStudent] = useState([]);
//   const [selectedOutstanding, setSelectedOutstanding] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [processing, setProcessing] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [walletBalance, setWalletBalance] = useState(0);
//   const { user } = useContext(AuthContext);
//   const [activeTab, setActiveTab] = useState('current'); // 'current', 'outstanding', 'history'

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError('');
        
//         // Get student data
//         const studentResponse = await getStudentById(user._id);
//         const student = studentResponse.data;
//         setStudent(student);
//         if (!student) {
//           throw new Error('Student not found');
//         }

//         // Fetch all payment data
//         const [dueResponse, outstandingResponse, paidResponse, balanceResponse] = await Promise.all([
//           paymentService.getStudentPaymentsDue(user._id, student.data.class),
//           paymentService.getStudentOutstandingPayments(user._id),
//           paymentService.getStudentPaidPayments(user._id),
//           axios.get(`/fee/api/wallet/balance/${user._id}`).catch(() => ({ data: { balance: 0 }}))
//         ]);

//         setPaymentsDue(Array.isArray(dueResponse) ? dueResponse.filter(p => !p.isOutstanding) : []);
//         setOutstandingPayments(Array.isArray(dueResponse) ? dueResponse.filter(p => p.isOutstanding) : []);
//         setPaidPayments(Array.isArray(paidResponse) ? paidResponse : []);
//         setWalletBalance(balanceResponse?.data?.balance || 0);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError(err.message || 'Failed to fetch data');
//         setPaymentsDue([]);
//         setOutstandingPayments([]);
//         setPaidPayments([]);
//         setWalletBalance(0);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchData();
//   }, [user._id, success]);
 
//   const handleCheckboxChange = (paymentId, isChecked, isOutstanding = false) => {
//     if (isOutstanding) {
//       if (isChecked) {
//         setSelectedOutstanding([...selectedOutstanding, paymentId]);
//       } else {
//         setSelectedOutstanding(selectedOutstanding.filter(id => id !== paymentId));
//       }
//     } else {
//       if (isChecked) {
//         setSelectedPayments([...selectedPayments, paymentId]);
//       } else {
//         setSelectedPayments(selectedPayments.filter(id => id !== paymentId));
//       }
//     }
//   };

//   const calculateTotal = () => {
//     const currentTotal = paymentsDue
//       .filter(pt => selectedPayments.includes(pt._id))
//       .reduce((sum, pt) => sum + (pt?.amount || 0), 0);

//     const outstandingTotal = outstandingPayments
//       .filter(op => selectedOutstanding.includes(op.outstandingId || op._id))
//       .reduce((sum, op) => sum + (op?.amount || 0), 0);

//     return currentTotal + outstandingTotal;
//   };

//   // const handleWalletPayment = async () => {
//   //   try {
//   //     setProcessing(true);
//   //     setError('');
//   //     setSuccess('');
      
//   //     const totalAmount = calculateTotal();
      
//   //     if (totalAmount > walletBalance) {
//   //       throw new Error('Insufficient wallet balance');
//   //     }

//   //     const response = await axios.post(`/fee/api/wallet/pay/${user._id}`, {
//   //       paymentTypeIds: selectedPayments,
//   //       outstandingIds: selectedOutstanding
//   //     });
      
//   //     setSuccess('Payment successful!');
//   //     setSelectedPayments([]);
//   //     setSelectedOutstanding([]);
//   //     setWalletBalance(response?.data?.newBalance || walletBalance - totalAmount);
      
//   //     // Refresh payment data
//   //     const [due, outstanding, paid, balance] = await Promise.all([
//   //       paymentService.getStudentPaymentsDue(user._id, student?.data?.class),
//   //       paymentService.getStudentOutstandingPayments(user._id),
//   //       paymentService.getStudentPaidPayments(user._id),
//   //       axios.get(`/fee/api/wallet/balance/${user._id}`).catch(() => ({ data: { balance: walletBalance - totalAmount } }))
//   //     ]);
      
//   //     setPaymentsDue(Array.isArray(due) ? due.filter(p => !p.isOutstanding) : []);
//   //     setOutstandingPayments(Array.isArray(due) ? due.filter(p => p.isOutstanding) : []);
//   //     setPaidPayments(paid || []);
//   //     setWalletBalance(balance?.data?.balance || walletBalance - totalAmount);
//   //   } catch (err) {
//   //     setError(err.response?.data?.message || err.message || 'Payment failed');
//   //   } finally {
//   //     setProcessing(false);
//   //   }
//   // };


//   const handleWalletPayment = async () => {
//     try {
//       setProcessing(true);
//       setError('');
//       setSuccess('');
      
//       const totalAmount = calculateTotal();
      
//       if (totalAmount > walletBalance) {
//         throw new Error('Insufficient wallet balance');
//       }
  
//       // Updated endpoint and response handling
//       const response = await axios.post(`/fee/api/wallet/wallet-pay-with-outstanding/${user._id}`, {
//         paymentTypeIds: selectedPayments,
//         outstandingIds: selectedOutstanding
//       });
      
//       setSuccess(response.data.message || 'Payment successful including outstanding debts!');
//       setSelectedPayments([]);
//       setSelectedOutstanding([]);
//       setWalletBalance(response.data.newBalance);
      
//       // Refresh payment data
//       const [due, outstanding, paid, balance] = await Promise.all([
//         paymentService.getStudentPaymentsDue(user._id, student?.data?.class),
//         paymentService.getStudentOutstandingPayments(user._id),
//         paymentService.getStudentPaidPayments(user._id),
//         axios.get(`/fee/api/wallet/balance/${user._id}`)
//       ]);
      
//       setPaymentsDue(Array.isArray(due) ? due.filter(p => !p.isOutstanding) : []);
//       setOutstandingPayments(Array.isArray(outstanding) ? outstanding : []);
//       setPaidPayments(paid || []);
//       setWalletBalance(balance?.data?.balance || response.data.newBalance);
      
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || 'Payment failed');
//     } finally {
//       setProcessing(false);
//     }
//   };

//   const renderPaymentItem = (payment, isPaid = false, isOutstanding = false) => {
//     const paymentAmount = payment.amount || payment.paymentType?.amount || 0;
//     const paymentName = payment.name || payment.paymentType?.name || 'Unnamed Payment';
//     const paymentDescription = payment.description || payment.paymentType?.description || 'No description';
//     const date = isPaid ? payment.datePaid : payment.dueDate || payment.originalDueDate;

//     return (
//       <div key={payment._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-3">
//         <div className="flex items-start justify-between">
//           <div className="flex-1 min-w-0">
//             <div className="flex items-center space-x-3">
//               {!isPaid && (
//                 <input
//                   type="checkbox"
//                   checked={
//                     isOutstanding
//                       ? selectedOutstanding.includes(payment.outstandingId || payment._id)
//                       : selectedPayments.includes(payment._id)
//                   }
//                   onChange={(e) => handleCheckboxChange(
//                     isOutstanding ? (payment.outstandingId || payment._id) : payment._id,
//                     e.target.checked,
//                     isOutstanding
//                   )}
//                   className="h-4 w-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
//                 />
//               )}
//               <h3 className={`text-lg font-medium truncate ${isPaid ? 'text-gray-500' : 'text-gray-900'}`}>
//                 {paymentName}
//                 {isOutstanding && (
//                   <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//                     Outstanding
//                   </span>
//                 )}
//                 {isPaid && (
//                   <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                     Paid
//                   </span>
//                 )}
//               </h3>
//             </div>
//             <p className="mt-1 text-sm text-gray-500">
//               {paymentDescription}
//               {isOutstanding && payment.originalLevel && (
//                 <span className="block text-xs text-gray-400">
//                   From: {payment.originalLevel.name} (Previous Class)
//                 </span>
//               )}
//             </p>
            
//             <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
//               <div>
//                 <span className="font-medium text-gray-500">Amount:</span>
//                 <span className="ml-1 font-semibold">
//                   ₦{paymentAmount.toLocaleString()}
//                 </span>
//               </div>
//               <div>
//                 <span className="font-medium text-gray-500">
//                   {isPaid ? 'Paid Date:' : 'Due Date:'}
//                 </span>
//                 <span className="ml-1">
//                   {date ? new Date(date).toLocaleDateString() : 'No date'}
//                 </span>
//               </div>
//             </div>
//           </div>
          
//           <div className="ml-4 flex-shrink-0">
//             <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
//               isPaid ? 'bg-green-100 text-green-800' :
//               isOutstanding ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
//             }`}>
//               {isPaid ? 'Paid' : isOutstanding ? 'Outstanding' : 'Unpaid'}
//             </span>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'current':
//         return (
//           <div className="space-y-4">
//             {paymentsDue.length > 0 ? (
//               paymentsDue.map(payment => renderPaymentItem(payment))
//             ) : (
//               <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
//                 <p className="text-gray-500">No current pending payments</p>
//               </div>
//             )}
//           </div>
//         );
//       case 'outstanding':
//         return (
//           <div className="space-y-4">
//             {outstandingPayments.length > 0 ? (
//               <>
//                 <p className="text-sm text-gray-500 mb-3">
//                   These are unpaid fees from previous classes
//                 </p>
//                 {outstandingPayments.map(payment => renderPaymentItem(payment, false, true))}
//               </>
//             ) : (
//               <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
//                 <p className="text-gray-500">No outstanding payments</p>
//               </div>
//             )}
//           </div>
//         );
//       case 'history':
//         return (
//           <div className="space-y-4">
//             {paidPayments.length > 0 ? (
//               paidPayments.map(payment => renderPaymentItem(payment, true))
//             ) : (
//               <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
//                 <p className="text-gray-500">No payment history</p>
//               </div>
//             )}
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="container mx-auto p-4 max-w-6xl">
//       <h2 className="text-2xl font-semibold mb-6">My Payments</h2>

//       {/* Wallet Balance Card */}
//       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h3 className="text-lg font-medium text-blue-800">Wallet Balance</h3>
//             <p className="text-sm text-blue-600">Available for payments</p>
//           </div>
//           <span className="text-2xl font-bold text-blue-700">
//             ₦{(walletBalance || 0).toLocaleString()}
//           </span>
//         </div>
//       </div>

//       {/* Status Messages */}
//       {error && (
//         <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
//           <div className="flex">
//             <div className="flex-shrink-0">
//               <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <p className="text-sm text-red-700">{error}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {success && (
//         <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
//           <div className="flex">
//             <div className="flex-shrink-0">
//               <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <p className="text-sm text-green-700">{success}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Payment Tabs */}
//       <div className="mb-6">
//         <div className="border-b border-gray-200">
//           <nav className="-mb-px flex space-x-8">
//             <button
//               onClick={() => setActiveTab('current')}
//               className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === 'current'
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               Current Pending
//               {paymentsDue.length > 0 && (
//                 <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                   {paymentsDue.length}
//                 </span>
//               )}
//             </button>
//             <button
//               onClick={() => setActiveTab('outstanding')}
//               className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === 'outstanding'
//                   ? 'border-yellow-500 text-yellow-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               Outstanding Payments
//               {outstandingPayments.length > 0 && (
//                 <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//                   {outstandingPayments.length}
//                 </span>
//               )}
//             </button>
//             <button
//               onClick={() => setActiveTab('history')}
//               className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === 'history'
//                   ? 'border-green-500 text-green-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               Payment History
//               {paidPayments.length > 0 && (
//                 <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                   {paidPayments.length}
//                 </span>
//               )}
//             </button>
//           </nav>
//         </div>
//       </div>

//       {/* Payment Summary Card - Only shown when on current or outstanding tabs with selections */}
//       {(activeTab === 'current' || activeTab === 'outstanding') &&
//       (selectedPayments.length > 0 || selectedOutstanding.length > 0) && (
//         <div className="bg-white shadow-md rounded-lg p-4 mb-6 border border-gray-200">
//           <div className="flex justify-between items-center">
//             <div>
//               <h3 className="text-lg font-medium">Payment Summary</h3>
//               <p className="text-sm text-gray-500">
//                 {selectedPayments.length + selectedOutstanding.length} item{(selectedPayments.length + selectedOutstanding.length) !== 1 ? 's' : ''} selected
//               </p>
//             </div>
//             <div className="text-right">
//               <p className="text-sm font-medium">Total Amount</p>
//               <p className="text-xl font-bold">
//                 ₦{calculateTotal().toLocaleString()}
//               </p>
//             </div>
//           </div>

//           <div className={`mt-4 p-3 rounded-md ${calculateTotal() > walletBalance ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
//             {calculateTotal() > walletBalance ? (
//               <p className="text-sm">
//                 Insufficient wallet balance. You need ₦{(calculateTotal() - walletBalance).toLocaleString()} more.
//               </p>
//             ) : (
//               <p className="text-sm">
//                 Wallet balance will be: ₦{(walletBalance - calculateTotal()).toLocaleString()} after payment
//               </p>
//             )}
//           </div>

//           <button
//             className={`mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
//               calculateTotal() > walletBalance ||
//               (activeTab === 'current' && selectedPayments.length === 0) ||
//               (activeTab === 'outstanding' && selectedOutstanding.length === 0)
//                 ? 'bg-gray-400 cursor-not-allowed'
//                 : 'bg-blue-600 hover:bg-blue-700'
//             } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
//             onClick={handleWalletPayment}
//             disabled={
//               processing ||
//               calculateTotal() > walletBalance ||
//               (activeTab === 'current' && selectedPayments.length === 0) ||
//               (activeTab === 'outstanding' && selectedOutstanding.length === 0)
//             }
//           >
//             {processing ? (
//               <>
//                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Processing...
//               </>
//             ) : (
//               'Pay with Wallet'
//             )}
//           </button>
//         </div>
//       )}

//       {/* Payments List */}
//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//           </svg>
//         </div>
//       ) : (
//         renderTabContent()
//       )}
//     </div>
//   );
// };

// export default StudentPayments;



import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import paymentService from '../../services/Paymentservices';
import { getStudentById } from '../../services/studentService';
import axios from 'axios';

const StudentPayments = () => {
  const [paymentsDue, setPaymentsDue] = useState([]);
  const [outstandingPayments, setOutstandingPayments] = useState([]);
  const [paidPayments, setPaidPayments] = useState([]);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [student, setStudent] = useState(null);
  const [selectedOutstanding, setSelectedOutstanding] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('current');


  const normalizeOutstandingPayments = (payments) => {
    if (!payments) return [];
    
    return payments.map(payment => ({
      ...payment,
      _id: payment._id || payment.paymentTypeId,
      paymentTypeId: payment.paymentTypeId || payment._id,
      amountDue: payment.amountDue || payment.amount || payment.paymentType?.amount,
      originalDueDate: payment.originalDueDate || payment.dueDate || payment.paymentType?.dueDate,
      isOutstanding: true,
      originalLevel: payment.originalLevel || payment.level || student?.class 
    }));
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const studentResponse = await getStudentById(user._id);
        if (!studentResponse?.data?.data?.class) {
          throw new Error('Student not found');
        }
        setStudent(studentResponse.data.data);
        console.log(studentResponse,'Response')
  
        // Fetch all data in parallel
        const [dueResponse, outstandingResponse, paidResponse, balanceResponse] = await Promise.all([
          paymentService.getStudentPaymentsDue(user._id, studentResponse.data.data.class),
          paymentService.getStudentOutstandingPayments(studentResponse.data.data._id).catch(() => ({ outstanding: [] })), // Return empty object if fails
          paymentService.getStudentPaidPayments(user._id),
          axios.get(`/fee/api/wallet/balance/${user._id}`).catch(() => ({ data: { balance: 0 }}))
        ]);
  
        console.log(dueResponse, 'due')
        console.log( outstandingResponse, 'outstanding')
        // Process outstanding payments
        let processedOutstanding = [];
        if (outstandingResponse?.outstanding) {
          processedOutstanding = normalizeOutstandingPayments(outstandingResponse.outstanding);
        } else if (Array.isArray(outstandingResponse)) {
          processedOutstanding = normalizeOutstandingPayments(outstandingResponse);
        }
  
        // Process current payments - filter out any that exist in outstanding
        let processedCurrent = [];
        if (dueResponse?.currentPending) {
          // Create a Set of outstanding payment IDs for quick lookup
          const outstandingIds = new Set(
            processedOutstanding.map(p => p.paymentTypeId || p._id)
          );
  
          processedCurrent = dueResponse.currentPending.filter(payment => {
            // Skip if payment is marked as outstanding
            if (payment.status === 'outstanding') return false;
            
            // Skip if payment exists in outstanding list
            if (outstandingIds.has(payment._id)) return false;
            
            // Skip if payment's paymentTypeId exists in outstanding list
            if (payment.paymentType?._id && outstandingIds.has(payment.paymentType._id)) return false;
            
            return true;
          });
        }
  
        // Process paid payments
        let processedPaid = [];
        if (Array.isArray(paidResponse)) {
          processedPaid = paidResponse;
        }
  
        setPaymentsDue(processedCurrent);
        setOutstandingPayments(processedOutstanding);
        setPaidPayments(processedPaid);
        setWalletBalance(balanceResponse.data.balance || 0);
  
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || 'Failed to fetch payment data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [user._id, success]);


  const handleCheckboxChange = (paymentId, isChecked, isOutstanding = false) => {
    if (isOutstanding) {
      setSelectedOutstanding(prev => 
        isChecked ? [...prev, paymentId] : prev.filter(id => id !== paymentId)
      );
    } else {
      setSelectedPayments(prev => 
        isChecked ? [...prev, paymentId] : prev.filter(id => id !== paymentId)
      );
    }
  };

  const calculateTotal = () => {
    const currentTotal = paymentsDue
      .filter(pt => selectedPayments.includes(pt._id))
      .reduce((sum, pt) => sum + (pt.amount || 0), 0);

    const outstandingTotal = outstandingPayments
      .filter(op => selectedOutstanding.includes(op._id))
      .reduce((sum, op) => sum + (op.amountDue || op.amount || 0), 0);

    return currentTotal + outstandingTotal;
  };

  const handleWalletPayment = async () => {
    try {
      setProcessing(true);
      setError('');
      setSuccess('');
      
      console.log('Selected Payments:', selectedPayments);
      console.log('Selected Outstanding:', selectedOutstanding);
      console.log('All Outstanding Payments:', outstandingPayments);
      
      // Validate that we have the outstanding payment data
      if (selectedOutstanding.length > 0 && outstandingPayments.length === 0) {
        throw new Error('Outstanding payments data not loaded. Please refresh and try again.');
      }
      
      const totalAmount = calculateTotal();
      
      if (totalAmount > walletBalance) {
        throw new Error('Insufficient wallet balance');
      }
  
      // Ensure we're sending the correct data structure
      const paymentData = {
        paymentTypeIds: selectedPayments,
        outstandingIds: selectedOutstanding
      };
  
      console.log('Sending to backend:', paymentData);
      
      const response = await axios.post(
        `/fee/api/wallet/wallet-pay-with-outstanding/${user._id}`,
        paymentData
      );
      
      setSuccess(response.data.message || 'Payment successful!');
      setSelectedPayments([]);
      setSelectedOutstanding([]);
      setWalletBalance(response.data.newBalance);
      
      // Refresh data with better error handling
      try {
        const [due, outstanding, paid, balance] = await Promise.all([
          paymentService.getStudentPaymentsDue(user._id, student?.class),
          paymentService.getStudentOutstandingPayments(user._id).catch(err => {
            console.error('Error fetching outstanding:', err);
            return []; // Return empty array instead of failing
          }),
          paymentService.getStudentPaidPayments(user._id),
          axios.get(`/fee/api/wallet/balance/${user._id}`).catch(() => ({ data: { balance: walletBalance }}))
        ]);
  
        // Process the refreshed data with better checks
        const newOutstanding = Array.isArray(outstanding) 
          ? normalizeOutstandingPayments(outstanding) 
          : outstanding?.data 
            ? normalizeOutstandingPayments(outstanding.data)
            : [];
  
        const newCurrent = Array.isArray(due?.currentPending) 
          ? due.currentPending.filter(p => 
              !newOutstanding.some(op => op._id === p._id) && 
              !p.isOutstanding
            )
          : [];
  
        setPaymentsDue(newCurrent);
        setOutstandingPayments(newOutstanding);
        setPaidPayments(Array.isArray(paid) ? paid : []);
        
      } catch (refreshError) {
        console.error('Error refreshing data:', refreshError);
        // Don't show error to user for background refresh
      }
      
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || err.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  // const handleWalletPayment = async () => {
  //   try {

  //     console.log('Selected Payments:', selectedPayments);
  //     console.log('Selected Outstanding:', selectedOutstanding);
  //     console.log('All Outstanding Payments:', outstandingPayments);

  //     setProcessing(true);
  //     setError('');
  //     setSuccess('');
      
  //     const totalAmount = calculateTotal();
      
  //     if (totalAmount > walletBalance) {
  //       throw new Error('Insufficient wallet balance');
  //     }

  //     const response = await axios.post(`/fee/api/wallet/wallet-pay-with-outstanding/${user._id}`, {
  //       paymentTypeIds: selectedPayments,
  //       outstandingIds: selectedOutstanding
  //     });
      
  //     setSuccess(response.data.message || 'Payment successful!');
  //     setSelectedPayments([]);
  //     setSelectedOutstanding([]);
  //     setWalletBalance(response.data.newBalance);
      
  //     // Refresh data
  //     const [due, outstanding, paid, balance] = await Promise.all([
  //       paymentService.getStudentPaymentsDue(user._id, student?.class),
  //       paymentService.getStudentOutstandingPayments(user._id),
  //       paymentService.getStudentPaidPayments(user._id),
  //       axios.get(`/fee/api/wallet/balance/${user._id}`).catch(() => ({ data: { balance: 0 }}))
  //     ]);

  //     // Process the refreshed data
  //     const newOutstanding = Array.isArray(outstanding) ? normalizeOutstandingPayments(outstanding) : [];
  //     const newCurrent = Array.isArray(due?.currentPending) 
  //       ? due.currentPending.filter(p => 
  //           !newOutstanding.some(op => op._id === p._id) && 
  //           !p.isOutstanding
  //         )
  //       : [];

  //     setPaymentsDue(newCurrent);
  //     setOutstandingPayments(newOutstanding);
  //     setPaidPayments(Array.isArray(paid) ? paid : []);
  //     setWalletBalance(balance.data.balance || response.data.newBalance);
      
  //   } catch (err) {
  //     console.error('Payment error:', err);
  //     setError(err.response?.data?.message || err.message || 'Payment failed');
  //   } finally {
  //     setProcessing(false);
  //   }
  // };

  const renderPaymentItem = (payment, isPaid = false, isOutstanding = false) => {
    console.log(payment._id, "payment Id")
    const paymentId = payment._id;
    const paymentAmount = isOutstanding
      ? (payment.amountDue || payment.amount)
      : (payment.amount || payment.paymentType?.amount || 0);
    
    const paymentName = payment.name || payment.paymentType?.name || 'Unnamed Payment';
    const paymentDescription = payment.description || payment.paymentType?.description || 'No description';
    const date = isPaid ? payment.datePaid : (payment.dueDate || payment.originalDueDate);
  
    return (
      <div key={paymentId} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3">
              {!isPaid && (
                <input
                  type="checkbox"
                  checked={isOutstanding
                    ? selectedOutstanding.includes(paymentId)
                    : selectedPayments.includes(paymentId)
                  }
                  onChange={(e) => handleCheckboxChange(paymentId, e.target.checked, isOutstanding)}
                  className="h-4 w-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
                />
              )}
              <h3 className={`text-lg font-medium truncate ${isPaid ? 'text-gray-500' : 'text-gray-900'}`}>
                {paymentName}
                {isOutstanding && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Outstanding
                  </span>
                )}
                {isPaid && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Paid
                  </span>
                )}
              </h3>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {paymentDescription}
              {isOutstanding && payment.originalLevel && (
                <span className="block text-xs text-gray-400">
                  From: {payment.originalLevel.name || 'Previous Class'}
                </span>
              )}
            </p>
            
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium text-gray-500">Amount:</span>
                <span className="ml-1 font-semibold">
                  ₦{paymentAmount.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  {isPaid ? 'Paid Date:' : 'Due Date:'}
                </span>
                <span className="ml-1">
                  {date ? new Date(date).toLocaleDateString() : 'No date'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="ml-4 flex-shrink-0">
            <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
              isPaid ? 'bg-green-100 text-green-800' :
              isOutstanding ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              {isPaid ? 'Paid' : isOutstanding ? 'Outstanding' : 'Unpaid'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
case 'current':
  return (
    <div className="space-y-4">
      {paymentsDue.length > 0 ? (
        paymentsDue
          .filter(payment => !payment.isOutstanding && payment.status !== 'outstanding')
          .map(payment => renderPaymentItem(payment))
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-gray-500">No current pending payments</p>
        </div>
      )}
    </div>
  );
      case 'outstanding':
        return (
          <div className="space-y-4">
            {outstandingPayments.length > 0 ? (
              <>
                <p className="text-sm text-gray-500 mb-3">
                  These are unpaid fees from previous classes
                </p>
                {outstandingPayments.map(payment =>
                  renderPaymentItem(payment, false, true)
                )}
              </>
            ) : (
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                <p className="text-gray-500">No outstanding payments</p>
              </div>
            )}
          </div>
        );
      case 'history':
        return (
          <div className="space-y-4">
            {paidPayments.length > 0 ? (
              paidPayments.map(payment => renderPaymentItem(payment, true))
            ) : (
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                <p className="text-gray-500">No payment history</p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const hasSelectedPayments = selectedPayments.length > 0 || selectedOutstanding.length > 0;
  const totalAmount = calculateTotal();
  const insufficientBalance = totalAmount > walletBalance;
  const balanceAfterPayment = walletBalance - totalAmount;

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h2 className="text-2xl font-semibold mb-6">My Payments</h2>

      {/* Wallet Balance Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-blue-800">Wallet Balance</h3>
            <p className="text-sm text-blue-600">Available for payments</p>
          </div>
          <span className="text-2xl font-bold text-blue-700">
            ₦{(walletBalance || 0).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('current')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'current'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Current Pending
              {paymentsDue.length > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {paymentsDue.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('outstanding')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'outstanding'
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Outstanding Payments
              {outstandingPayments.length > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {outstandingPayments.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Payment History
              {paidPayments.length > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {paidPayments.length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Payment Summary Card */}
      {hasSelectedPayments && (
        <div className="bg-white shadow-md rounded-lg p-4 mb-6 border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Payment Summary</h3>
              <p className="text-sm text-gray-500">
                {selectedPayments.length + selectedOutstanding.length} item{(selectedPayments.length + selectedOutstanding.length) !== 1 ? 's' : ''} selected
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Total Amount</p>
              <p className="text-xl font-bold">
                ₦{totalAmount.toLocaleString()}
              </p>
            </div>
          </div>

          <div className={`mt-4 p-3 rounded-md ${insufficientBalance ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {insufficientBalance ? (
              <p className="text-sm">
                Insufficient wallet balance. You need ₦{(totalAmount - walletBalance).toLocaleString()} more.
              </p>
            ) : (
              <p className="text-sm">
                Wallet balance will be: ₦{balanceAfterPayment.toLocaleString()} after payment
              </p>
            )}
          </div>

          <button
            className={`mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              insufficientBalance || processing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            onClick={handleWalletPayment}
            disabled={insufficientBalance || processing}
          >
            {processing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Pay with Wallet'
            )}
          </button>
        </div>
      )}

      {/* Payments List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : (
        renderTabContent()
      )}
    </div>
  );
};

export default StudentPayments;