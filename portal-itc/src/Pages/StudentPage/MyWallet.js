import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

const WalletPage = () => {
    const { user } = useContext(AuthContext);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fundAmount, setFundAmount] = useState('');
  const [fundLoading, setFundLoading] = useState(false);
  const [fundError, setFundError] = useState('');
  const [fundSuccess, setFundSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('balance');

    


  const studentId = user._id;
  const userEmail = user.email; // Assuming email is available in user context
  const userName = user.username || `${user.firstName} ${user.lastName}`;
    
    
    
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const response = await axios.get(`/fee/api/wallet/balance/${studentId}`);
        setWallet(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch wallet balance');
        setLoading(false);
      }
    };

    fetchWallet();
  }, [studentId]);

    
  const config = {
    public_key: process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: Date.now().toString(),
    amount: parseFloat(fundAmount),
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: userEmail,
      phonenumber: '', // Add if available
      name: userName,
    },
    customizations: {
      title: 'Wallet Funding',
      description: 'Adding funds to student wallet',
      logo: 'https://your-school-logo.png',
    },
  };

  const handleFlutterwavePayment = useFlutterwave(config);

    
    
    
//   const handleFundSubmit = async (e) => {
//     e.preventDefault();
//     setFundLoading(true);
//     setFundError('');
//     setFundSuccess('');

//     try {
//       const response = await axios.post(`/fee/api/wallet/fund/${studentId}`, {
//         amount: parseFloat(fundAmount)
//       });
//       setFundSuccess('Wallet funded successfully!');
//       setWallet(prev => ({
//         ...prev,
//         balance: response.data.newBalance,
//         transactions: [
//           {
//             _id: Date.now().toString(),
//             description: 'Wallet Funding',
//             amount: parseFloat(fundAmount),
//             type: 'credit',
//             status: 'completed',
//             createdAt: new Date().toISOString()
//           },
//           ...prev.transactions
//         ]
//       }));
//       setFundAmount('');
//     } catch (err) {
//       setFundError(err.response?.data?.message || 'Failed to fund wallet');
//     } finally {
//       setFundLoading(false);
//     }
//   };

    
// const handleFundSubmit = async (e) => {
//     e.preventDefault();
//     setFundLoading(true);
//     setFundError('');
//     setFundSuccess('');

//     if (!fundAmount || parseFloat(fundAmount) <= 0) {
//       setFundError('Please enter a valid amount');
//       setFundLoading(false);
//       return;
//     }

    // // Initialize Flutterwave payment
    // handleFlutterwavePayment({
    //   callback: async (response) => {
    //     try {
    //       // Verify payment with your backend
    //       const verification = await axios.post('/fee/api/wallet/verify-flutterwave', {
    //         transaction_id: response.transaction_id,
    //         amount: parseFloat(fundAmount),
    //         studentId: studentId
    //       });

    //       if (verification.data.success) {
    //         setFundSuccess('Wallet funded successfully!');
    //         setWallet(prev => ({
    //           ...prev,
    //           balance: verification.data.newBalance,
    //           transactions: [
    //             {
    //               _id: response.transaction_id,
    //               description: 'Wallet Funding via Flutterwave',
    //               amount: parseFloat(fundAmount),
    //               type: 'credit',
    //               status: 'completed',
    //               createdAt: new Date().toISOString()
    //             },
    //             ...prev.transactions
    //           ]
    //         }));
    //         setFundAmount('');
    //       } else {
    //         setFundError('Payment verification failed');
    //       }
    //     } catch (err) {
    //       setFundError(err.response?.data?.message || 'Payment processing failed');
    //     } finally {
    //       setFundLoading(false);
    //     }
    //   },
    //   onClose: () => {
    //     setFundLoading(false);
    //   },
    // });



    const handleFundSubmit = async (e) => {
        e.preventDefault();
        setFundLoading(true);
        setFundError('');
        setFundSuccess('');
      
        // Validate amount first
        if (!fundAmount || parseFloat(fundAmount) <= 0) {
          setFundError('Please enter a valid amount');
          setFundLoading(false);
          return;
        }
      
        // Flutterwave config
        const config = {
          public_key: process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY,
          tx_ref: `wallet-fund-${Date.now()}-${studentId}`,
          amount: parseFloat(fundAmount),
          currency: 'NGN',
          payment_options: 'card,account,ussd',
          customer: {
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            studentId: studentId // Passing your internal ID
          },
          meta: {
            studentId: studentId // Additional way to pass your ID
          },
          customizations: {
            title: 'School Wallet Funding',
            description: `Deposit to ${user.firstName}'s wallet`,
          },
        };
      
        // Initialize payment
        handleFlutterwavePayment({
          ...config,
          callback: async (response) => {
            try {
              const verification = await axios.post('/fee/api/wallet/verify-flutterwave', {
                transaction_id: response.transaction_id,
                amount: parseFloat(fundAmount),
                studentId: studentId
              }, {
                headers: {
                  'Content-Type': 'application/json'
                }
              });
      
              if (verification.data.success) {
                setFundSuccess('Wallet funded successfully!');
                setWallet(prev => ({
                  ...prev,
                  balance: verification.data.newBalance,
                  transactions: [
                    {
                      _id: verification.data.transactionId, // Use backend's ID
                      description: 'Wallet Funding via Flutterwave',
                      amount: parseFloat(fundAmount),
                      type: 'credit',
                      status: 'completed',
                      createdAt: new Date().toISOString(),
                      reference: response.tx_ref
                    },
                    ...prev.transactions
                  ]
                }));
                setFundAmount('');
              } else {
                setFundError(verification.data.message || 'Payment verification failed');
              }
            } catch (err) {
              const errorMsg = err.response?.data?.error || 
                              err.response?.data?.message || 
                              'Payment processing failed';
              setFundError(errorMsg);
              
              // Optional: Log detailed error for debugging
              console.error('Payment verification error:', {
                error: err,
                response: err.response?.data
              });
            } finally {
              setFundLoading(false);
            }
          },
          onClose: () => {
            // Called when modal is closed
            setFundLoading(false);
          },
        });
     
    
  };
    
    
  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
      <p>{error}</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Wallet</h1>
      
      {/* Balance Card */}
      <div className="rounded-lg shadow-md p-6 mb-8 bg-blue-100 border-l-2 border-blue-500">
        <div className="flex justify-between items-center mb-4 ">
          <h2 className="text-xl font-semibold text-blue-700">Available Balance</h2>
          <span className="text-2xl font-bold text-blue-600">
            ₦{wallet.balance.toLocaleString()}
          </span>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'balance' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('balance')}
        >
          Transactions
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'fund' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('fund')}
        >
          Fund Wallet
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === 'balance' ? (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Transactions</h3>
            {wallet.transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {wallet.transactions.map(tx => (
                      <tr key={tx._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tx.description}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.type === 'credit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tx.type === 'credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tx.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No transactions yet</p>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-700 mb-6">Fund Your Wallet</h3>
            <form onSubmit={handleFundSubmit}>
              <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  min="1"
                  step="0.01"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter amount"
                />
              </div>
              
              {fundError && (
                <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
                  <p>{fundError}</p>
                </div>
              )}
              
              {fundSuccess && (
                <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700">
                  <p>{fundSuccess}</p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={fundLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${fundLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {fundLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : 'Fund Wallet'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletPage;