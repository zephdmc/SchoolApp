
import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import paymentService from '../../services/Paymentservices';
import { getStudentById } from '../../services/studentService';
import { getClassById } from '../../services/ClassService';
import axios from 'axios';
import { MdOutlineSignalWifiStatusbarNull } from 'react-icons/md';

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
  const [classes, setClass] = useState('');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [studentMainID, setStudentID] = useState(MdOutlineSignalWifiStatusbarNull)

  
// FIXED: Simplified normalization function
const normalizeOutstandingPayments = (payments) => {
  if (!payments) return [];
  
  console.log('Raw outstanding payments:', payments);
  
  return payments.map(payment => ({
    ...payment,
    _id: payment._id,
    paymentTypeId: payment.paymentType?._id || payment._id,
    amountDue: payment.amountDue || payment.paymentType?.amount || 0,
    originalDueDate: payment.originalDueDate || payment.paymentType?.dueDate,
    name: payment.name || payment.paymentType?.name || 'Unnamed Payment',
    description: payment.description || payment.paymentType?.description || 'No description',
    isOutstanding: true,
    originalLevel: payment.originalLevel || payment.level,
    student: payment.student || user._id
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
      console.log('Student response:', studentResponse.data.data);

      // Get the student's custom ID for backend requests
      const studentCustomId = studentResponse.data.data.studentID;
      console.log(studentCustomId, "servic")

      setStudentID(studentCustomId)
      const [classes, dueResponse, outstandingResponse, paidResponse, balanceResponse] = await Promise.all([
        getClassById(studentResponse.data.data.class),
        paymentService.getStudentPaymentsDue(user._id, studentResponse.data.data.class),
        paymentService.getStudentOutstandingPayments(studentCustomId).catch(err => {
          console.error('Outstanding payments error:', err);
          return { data: [] }; // Return empty array on error
        }),
        paymentService.getStudentPaidPayments(user._id),
        axios.get(`/fee/api/wallet/balance/${user._id}`).catch(() => ({ data: { balance: 0 }}))
      ]);
      
      setClass(classes.data.name);
      console.log('Classes:', classes.data.name);
      console.log('Due response:', dueResponse);
      console.log('Outstanding response:', outstandingResponse);
      console.log('Paid response:', paidResponse);
      
      // FIXED: Handle outstanding payments correctly
      let processedOutstanding = [];
      
      if (outstandingResponse?.data && Array.isArray(outstandingResponse.data)) {
        processedOutstanding = normalizeOutstandingPayments(outstandingResponse.data);
      }
      
      console.log('Processed outstanding:', processedOutstanding);
      
      // FIXED: No filtering needed - backend already returns only this student's payments
      // The backend uses the MongoDB _id to query, so payments already match user._id
      
      // Process current payments
      let processedCurrent = [];
      if (dueResponse?.currentPending) {
        const outstandingIds = new Set(
          processedOutstanding.map(p => p.paymentTypeId || p._id)
        );

        processedCurrent = dueResponse.currentPending.filter(payment => {
          if (payment.status === 'outstanding') return false;
          if (outstandingIds.has(payment._id)) return false;
          if (payment.paymentType?._id && outstandingIds.has(payment.paymentType._id)) return false;
          return true;
        });
      }

      // Process paid payments
      let processedPaid = [];
      if (Array.isArray(paidResponse)) {
        processedPaid = paidResponse;
      } else if (paidResponse?.data) {
        processedPaid = Array.isArray(paidResponse.data) ? paidResponse.data : [];
      }

      setPaymentsDue(processedCurrent);
      setOutstandingPayments(processedOutstanding);
      setPaidPayments(processedPaid);
      setWalletBalance(balanceResponse.data.balance || 0);

      console.log('Final outstanding payments:', processedOutstanding);

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

  // Alternative simpler validation - just check if selected IDs exist in outstandingPayments
const invalidOutstanding = selectedOutstanding.filter(
  selectedId => !outstandingPayments.some(op => op._id === selectedId)
);

if (invalidOutstanding.length > 0) {
  console.error('Invalid payment IDs:', invalidOutstanding);
  throw new Error(`Some selected payments are invalid or don't belong to you. Please refresh and try again.`);
}

    const { default: mongoose } = await import('mongoose');
    
    const outstandingObjectIds = selectedOutstanding.map(id => {
      try {
        return new mongoose.Types.ObjectId(id);
      } catch (error) {
        console.error(`Invalid ID format: ${id}`, error);
        throw new Error(`Invalid payment ID format: ${id}`);
      }
    });

    const paymentTypeObjectIds = selectedPayments.map(id => {
      try {
        return new mongoose.Types.ObjectId(id);
      } catch (error) {
        console.error(`Invalid ID format: ${id}`, error);
        throw new Error(`Invalid payment ID format: ${id}`);
      }
    });

    // Ensure we're sending the correct data structure with ObjectIds
    const paymentData = {
      paymentTypeIds: paymentTypeObjectIds,
      outstandingIds: outstandingObjectIds
    };

    console.log('Sending to backend with ObjectIds:', paymentData);
    
    const response = await axios.post(
      `/fee/api/wallet/wallet-pay-with-outstanding/${studentMainID}`,
      paymentData
    );
    

    console.log('Selected Payments (current):', selectedPayments);
console.log('Selected Outstanding:', selectedOutstanding);
console.log('All Payments Due:', paymentsDue);
console.log('All Outstanding Payments:', outstandingPayments);



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

      // Filter to only current user's payments
      const filteredOutstanding = newOutstanding.filter(payment => payment.student === user._id);

      const newCurrent = Array.isArray(due?.currentPending) 
        ? due.currentPending.filter(p => 
            !filteredOutstanding.some(op => op._id === p._id) && 
            !p.isOutstanding
          )
        : [];

      setPaymentsDue(newCurrent);
      setOutstandingPayments(filteredOutstanding);
      setPaidPayments(Array.isArray(paid) ? paid : []);
      
    } catch (refreshError) {
      console.error('Error refreshing data:', refreshError);
      // Don't show error to user for background refresh
    }
    
  } catch (err) {
    console.error('Payment error:', err);
    
    // Enhanced error handling to show backend response details
    if (err.response?.data) {
      const backendError = err.response.data;
      console.log('Backend error details:', backendError);
      
      if (backendError.details) {
        // Show detailed error message from backend
        setError(`${backendError.message}: ${JSON.stringify(backendError.details)}`);
      } else {
        setError(backendError.message || err.message || 'Payment failed');
      }
    } else {
      setError(err.message || 'Payment failed');
    }
  } finally {
    setProcessing(false);
  }
  };
  
  

  const handlePrintReceipt = (payment) => {
  setSelectedReceipt(payment);
  setShowReceiptModal(true);
};

const handleCloseModal = () => {
  setShowReceiptModal(false);
  setSelectedReceipt(null);
};

const handlePrint = () => {
  // Create a style element for print-specific styles
  const printStyles = `
    @media print {
      body * {
        visibility: hidden;
        margin: 0 !important;
        padding: 0 !important;
      }
      #receipt-content, #receipt-content * {
        visibility: visible;
      }
      #receipt-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: white;
        margin: 0 !important;
        padding: 0 !important;
      }
      @page {
        size: A4 portrait;
        margin: 15mm;
      }
    }
  `;
  
  // Add the print styles to the document
  const styleElement = document.createElement('style');
  styleElement.innerHTML = printStyles;
  document.head.appendChild(styleElement);
  
  // Print the document
  window.print();
  
  // Remove the print styles after printing
  setTimeout(() => {
    document.head.removeChild(styleElement);
    setShowReceiptModal(false);
    setSelectedReceipt(null);
  }, 100);
  };
  
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
                paidPayments.map(payment => (
                  <div key={payment._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium truncate text-gray-500">
                            {payment.name || payment.paymentType?.name || 'Unnamed Payment'}
                          </h3>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {payment.description || payment.paymentType?.description || 'No description'}
                        </p>
                        
                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium text-gray-500">Amount:</span>
                            <span className="ml-1 font-semibold">
                              ₦{(payment.amount || payment.paymentType?.amount || 0).toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Paid Date:</span>
                            <span className="ml-1">
                              {payment.datePaid ? new Date(payment.datePaid).toLocaleDateString() : 'No date'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4 flex flex-col items-end space-y-2">
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          Paid
                        </span>
<button
  onClick={() => handlePrintReceipt(payment)}
  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
>
  Print Receipt
</button>
                      </div>
                    </div>
                  </div>
                ))
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

      

{/* DEBUG SECTION - Add this temporarily */}
<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Debug Info:</strong> Outstanding payments: {outstandingPayments.length}
            </p>
            <button 
              onClick={() => console.log('Outstanding payments:', outstandingPayments)}
              className="mt-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded"
            >
              Log to Console
            </button>
          </div>
        </div>
      </div>


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


      {/* Receipt Modal */}
{/* Receipt Modal */}
{showReceiptModal && selectedReceipt && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
      <div className="flex justify-between items-center p-4 border-b print:hidden">
        <h3 className="text-lg font-semibold">Payment Receipt</h3>
        <button
          onClick={handleCloseModal}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Receipt Content */}
      <div id="receipt-content" className="p-6 print:p-0">
        <div className="bg-white text-gray-800 mx-auto print:w-[210mm] print:h-[297mm] print:mx-0">
          <div className="container mx-auto p-8 print:p-[15mm]">
            {/* Watermark */}
            <div className="absolute top-1/2 left-1/4 opacity-5 text-9xl font-bold transform -rotate-45 -translate-x-1/2 -translate-y-1/2 pointer-events-none print:opacity-10 print:text-[120px]">EXCELLENCE ACADEMY</div>
            
            {/* Header */}
            <div className="text-center mb-8 border-b-2 border-blue-200 pb-6 print:mb-6 print:pb-4">
              <h1 className="text-3xl font-bold text-blue-800 print:text-2xl">EXCELLENCE ACADEMY</h1>
              <p className="text-gray-600 mt-1 print:text-sm">123 Education Street, Knowledge City</p>
              <p className="text-gray-600 print:text-sm">Phone: (123) 456-7890 | Email: info@excellenceacademy.edu</p>
              <h2 className="text-xl font-semibold text-blue-700 mt-4 print:text-lg">OFFICIAL PAYMENT RECEIPT</h2>
            </div>
            
                  
   {/* QR Code Section - Modern Design */}
   <div className="flex justify-center mb-6 print:mb-4">
        <div className="bg-white p-4 border-2 border-dashed border-blue-100 rounded-xl shadow-sm print:border-0 print:shadow-none">
          <div className="text-center mb-3">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium print:text-[10px]">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              VERIFICATION CODE
            </div>
          </div>
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
              `https://schoolapp-nau2.onrender.com/portal/payment/${selectedReceipt._id}?name=${encodeURIComponent(student?.firstName + ' ' + student?.lastName)}&type=${encodeURIComponent(selectedReceipt.name || selectedReceipt.paymentType?.name || 'Payment')}`
            )}`} 
            alt="Payment Verification QR Code" 
            className="w-28 h-28 mx-auto print:w-24 print:h-24 border-4 border-white shadow-sm"
          />
          <div className="text-center mt-3">
            <p className="text-xs text-gray-500 font-medium print:text-[10px]">Scan to verify receipt</p>
            <p className="text-[10px] text-gray-400 mt-1 print:text-[9px]">ID: {selectedReceipt._id}</p>
          </div>
        </div>
      </div>
      

            {/* Receipt Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 print:grid-cols-2 print:gap-4 print:mb-6">
              <div>
                <div className="bg-blue-50 p-4 rounded-lg print:p-3 print:rounded-none print:border print:border-gray-300">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2 print:text-base">Student Information</h3>
                  <div className="space-y-2 print:space-y-1">
                    <p className="print:text-sm"><span className="font-medium">Name:</span> {student?.firstName || 'N/A'} {student?.lastName || 'N/A'}</p>
                    <p className="print:text-sm"><span className="font-medium">Application No:</span> {student?.admissionNumber || 'N/A'}</p>
                    <p className="print:text-sm"><span className="font-medium">Class:</span> {classes || 'N/A'}</p>
                    <p className="print:text-sm"><span className="font-medium">Term:</span> {selectedReceipt.term || 'Current Term'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-gray-50 p-4 rounded-lg print:p-3 print:rounded-none print:border print:border-gray-300">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 print:text-base">Payment Details</h3>
                  <div className="space-y-2 print:space-y-1">
                    <p className="print:text-sm"><span className="font-medium">Receipt No:</span> {selectedReceipt._id || 'N/A'}</p>
                    <p className="print:text-sm"><span className="font-medium">Date:</span> {new Date(selectedReceipt.datePaid).toLocaleDateString()}</p>
                    <p className="print:text-sm"><span className="font-medium">Payment Type:</span> {selectedReceipt.name || selectedReceipt.paymentType?.name || 'N/A'}</p>
                    <p className="print:text-sm"><span className="font-medium">Status:</span> <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full print:px-1 print:py-0.5">Paid</span></p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment Summary */}
            <div className="mb-8 print:mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 border-b pb-2 print:text-base print:mb-3 print:pb-1">Payment Summary</h3>
              <div className="bg-gray-50 rounded-lg overflow-hidden print:rounded-none print:border print:border-gray-300">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 text-left font-medium text-gray-700 print:py-2 print:px-3 print:text-sm">Description</th>
                      <th className="py-3 px-4 text-right font-medium text-gray-700 print:py-2 print:px-3 print:text-sm">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 print:py-2 print:px-3 print:text-sm">{selectedReceipt.name || selectedReceipt.paymentType?.name || 'Payment'}</td>
                      <td className="py-3 px-4 text-right print:py-2 print:px-3 print:text-sm">₦{(selectedReceipt.amount || selectedReceipt.paymentType?.amount || 0).toLocaleString()}</td>
                    </tr>
                    <tr className="bg-blue-50 font-semibold">
                      <td className="py-3 px-4 print:py-2 print:px-3 print:text-sm">Total</td>
                      <td className="py-3 px-4 text-right text-blue-700 print:py-2 print:px-3 print:text-sm">₦{(selectedReceipt.amount || selectedReceipt.paymentType?.amount || 0).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Additional Information */}
            <div className="mb-8 print:mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2 print:text-base">Additional Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg print:p-3 print:rounded-none print:border print:border-gray-300">
                <p className="font-medium print:text-sm">Description:</p>
                <p className="mt-1 text-gray-700 print:text-sm">{selectedReceipt.description || selectedReceipt.paymentType?.description || 'No additional description'}</p>
              </div>
            </div>
            
            {/* Footer */}
            <div className="border-t-2 border-blue-200 pt-6 text-center text-sm text-gray-600 print:pt-4 print:text-xs">
              <p className="mb-2">Thank you for your payment!</p>
              <p>This is an official receipt from Excellence Academy</p>
              <p className="mt-4">Generated on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end p-4 border-t print:hidden">
        <button
          onClick={handleCloseModal}
          className="mr-4 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Close
        </button>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Print Receipt
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default StudentPayments;