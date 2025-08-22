// import React, { useState, useEffect } from 'react';
// import paymentService from '../../services/Paymentservices';
// import {getAllClasses} from '../../services/ClassService'; // corrected import path
// import { getAllSessions } from "../../services/SessionService";

// const PaymentTypes = () => {
//   const [paymentTypes, setPaymentTypes] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [sessions, setSessions] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     amount: '',
//     dueDate: '',
//     academicSession: '',
//     level: ''
//   });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const classData = await getAllClasses();
//         setClasses(classData);
//         const response = await getAllSessions();
//         setSessions(response || []);
//         const paymentData = await paymentService.getPaymentTypes();
//         setPaymentTypes(paymentData);
//       } catch (err) {
//         setError(err.message);
//       }
//     };
//     fetchData();
//   }, []);


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const newPaymentType = await paymentService.createPaymentType(formData);
//       setPaymentTypes([...paymentTypes, newPaymentType]);
//       setSuccess('Payment type created successfully');
//       setShowModal(false);
//       setFormData({
//         name: '',
//         description: '',
//         amount: '',
//         dueDate: '',
//         academicSession: '',
//         level: ''
//       });
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-4 font-sans">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Payment Types</h2>
//         <button
//           onClick={() => setShowModal(true)}
//           className="px-4 py-2 bg-itccolor text-white rounded hover:bg-blue-700"
//         >
//           Add Payment Type
//         </button>
//       </div>

//       {error && <div className="mb-4 text-red-600">{error}</div>}
//       {success && <div className="mb-4 text-green-600">{success}</div>}

//       <div className="overflow-x-auto shadow rounded-md">
//         <table className="min-w-full bg-white divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Name</th>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Description</th>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Amount</th>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Due Date</th>
//               <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-100">
//             {paymentTypes.map(pt => (
//               <tr key={pt._id}>
//                 <td className="px-4 py-3">{pt.name}</td>
//                 <td className="px-4 py-3">{pt.description}</td>
//                 <td className="px-4 py-3">₦{pt.amount.toLocaleString()}</td>
//                 <td className="px-4 py-3">{new Date(pt.dueDate).toLocaleDateString()}</td>
//                 <td className="px-4 py-3">{pt.isActive ? 'Active' : 'Inactive'}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
//             <h3 className="text-xl font-semibold mb-4">Add New Payment Type</h3>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="Name"
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 required
//                 className="w-full px-3 py-2 border rounded"
//               />
//               <textarea
//                 placeholder="Description"
//                 rows={3}
//                 value={formData.description}
//                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                 className="w-full px-3 py-2 border rounded"
//               />
//               <input
//                 type="number"
//                 placeholder="Amount"
//                 value={formData.amount}
//                 onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
//                 required
//                 className="w-full px-3 py-2 border rounded"
//               />
//               <input
//                 type="date"
//                 placeholder="Due Date"
//                 value={formData.dueDate}
//                 onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
//                 className="w-full px-3 py-2 border rounded"
//               />

//               <select
//                 value={formData.level}
//                 onChange={(e) => setFormData({ ...formData, level: e.target.value })}
//                 required
//                 className="w-full px-3 py-2 border rounded bg-white"
//               >
//                 <option value="">-- Select Class --</option>
//                 {classes.map(cls => (
//                   <option key={cls._id} value={cls._id}>
//                     {cls.name}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 value={formData.academicSession}
//                 onChange={(e) => setFormData({ ...formData, academicSession: e.target.value })}
//                 required
//                 className="w-full px-3 py-2 border rounded bg-white"
//               >
//                 <option value="">-- Select Session --</option>
//                 {sessions.map(ssn => (
//                   <option key={ssn._id} value={ssn._id}>
//                     {ssn.name}
//                   </option>
//                 ))}
//               </select>

//               <div className="flex justify-end space-x-2">
//                 <button
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                   className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                 >
//                   Save
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PaymentTypes;


import React, { useState, useEffect } from 'react';
import paymentService from '../../services/Paymentservices';
import { getAllClasses } from '../../services/ClassService';
import { getAllSessions } from "../../services/SessionService";

const PaymentTypes = () => {
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPaymentType, setCurrentPaymentType] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState({}); // Track which payments have been made
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: '',
    dueDate: '',
    academicSession: '',
    level: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classData = await getAllClasses();
        setClasses(classData);
        const response = await getAllSessions();
        setSessions(response || []);
        const paymentData = await paymentService.getPaymentTypes();
        setPaymentTypes(paymentData);

        // Check payment status for each payment type
        const statusData = await paymentService.getPaymentStatusForTypes();
        const statusMap = {};
        statusData.forEach(item => {
          statusMap[item.paymentTypeId] = item.hasPayments;
        });
        setPaymentStatus(statusMap);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPaymentType = await paymentService.createPaymentType(formData);
      setPaymentTypes([...paymentTypes, newPaymentType]);
      setSuccess('Payment type created successfully');
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (paymentType) => {
    setCurrentPaymentType(paymentType);
    setFormData({
      name: paymentType.name,
      description: paymentType.description,
      amount: paymentType.amount,
      dueDate: paymentType.dueDate.split('T')[0],
      academicSession: paymentType.academicSession,
      level: paymentType.level
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedPaymentType = await paymentService.updatePaymentType(
        currentPaymentType._id,
        formData
      );
      setPaymentTypes(paymentTypes.map(pt => 
        pt._id === currentPaymentType._id ? updatedPaymentType : pt
      ));
      setSuccess('Payment type updated successfully');
      setShowEditModal(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment type?')) {
      try {
        await paymentService.deletePaymentType(id);
        setPaymentTypes(paymentTypes.filter(pt => pt._id !== id));
        setSuccess('Payment type deleted successfully');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      amount: '',
      dueDate: '',
      academicSession: '',
      level: ''
    });
    setCurrentPaymentType(null);
  };

  const isPaymentEditable = (paymentTypeId) => {
    return !paymentStatus[paymentTypeId]; // Editable if no payments exist
  };

  return (
    <div className="max-w-7xl mx-auto p-4 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Payment Types</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-itccolor text-white rounded hover:bg-blue-700"
        >
          Add Payment Type
        </button>
      </div>

      {error && <div className="mb-4 text-red-600">{error}</div>}
      {success && <div className="mb-4 text-green-600">{success}</div>}
<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
  <div className="flex">
    <div className="flex-shrink-0">
      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    </div>
    <div className="ml-3">
      <p className="text-sm text-yellow-700">
        <strong>Important Notice:</strong> Payment types with existing student payments cannot be edited or deleted. 
        If you need to modify a payment type that already has payments, please contact the website administrator 
        for assistance. This is to maintain financial records integrity.
      </p>
    </div>
  </div>
</div>
      <div className="overflow-x-auto shadow rounded-md">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Description</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Amount</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Due Date</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paymentTypes.map(pt => (
              <tr key={pt._id}>
                <td className="px-4 text-[12px]  py-3">{pt.name}</td>
                <td className="px-4 text-[12px] py-3">{pt.description}</td>
                <td className="px-4 text-[12px] py-3">₦{pt.amount.toLocaleString()}</td>
                <td className="px-4 text-[12px] py-3">{new Date(pt.dueDate).toLocaleDateString()}</td>
                <td className="px-4 text-[12px] py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    pt.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {pt.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-[12px] space-x-2">
                  <button
                    onClick={() => handleEdit(pt)}
                    disabled={!isPaymentEditable(pt._id)}
                    className={`px-3 py-1 rounded ${
                      isPaymentEditable(pt._id) 
                        ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pt._id)}
                    disabled={!isPaymentEditable(pt._id)}
                    className={`px-3 py-1 text-[12px] rounded ${
                      isPaymentEditable(pt._id) 
                        ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Payment Type Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Add New Payment Type</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
            <input
             type="text"
                 placeholder="Name"
                 value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded"
               />
              <textarea
                placeholder="Description"
                rows={3}
                 value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                 className="w-full px-3 py-2 border rounded"
               />
               <input
                 type="number"
                 placeholder="Amount"
                value={formData.amount}
                 onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                 required
                 className="w-full px-3 py-2 border rounded"
               />
              <input
                type="date"
                placeholder="Due Date"
                 value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                 className="w-full px-3 py-2 border rounded"
              />

               <select
                 value={formData.level}
                 onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded bg-white"
              >
                 <option value="">-- Select Class --</option>
                 {classes.map(cls => (
                   <option key={cls._id} value={cls._id}>
                    {cls.name}
                   </option>
                ))}
               </select>

               <select
                value={formData.academicSession}
                 onChange={(e) => setFormData({ ...formData, academicSession: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded bg-white"
               >
                <option value="">-- Select Session --</option>
                {sessions.map(ssn => (
                  <option key={ssn._id} value={ssn._id}>
                     {ssn.name}
                  </option>
                ))}
               </select>

              <div className="flex justify-end space-x-2">
                <button
                   type="button"
                   onClick={() => setShowModal(false)}
                   className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                   Cancel
                 </button>
                 <button
                   type="submit"
                   className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                 >
                   Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Payment Type Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Edit Payment Type</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded"
              />
              <textarea
                placeholder="Description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="number"
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="date"
                placeholder="Due Date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />

              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded bg-white"
              >
                <option value="">-- Select Class --</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>

              <select
                value={formData.academicSession}
                onChange={(e) => setFormData({ ...formData, academicSession: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded bg-white"
              >
                <option value="">-- Select Session --</option>
                {sessions.map(ssn => (
                  <option key={ssn._id} value={ssn._id}>
                    {ssn.name}
                  </option>
                ))}
              </select>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentTypes;