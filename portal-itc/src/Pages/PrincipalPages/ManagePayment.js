import React, { useState, useEffect } from 'react';
import paymentService from '../../services/Paymentservices';
import { getAllClasses } from '../../services/ClassService';
import { getAllSessions } from "../../services/SessionService";
import PaymentTypeFilter from './../PrincipalPages/OverAllSubPages/PaymentTypeFilter';

const PaymentTypes = () => {
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [filteredPaymentTypes, setFilteredPaymentTypes] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPaymentType, setCurrentPaymentType] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState({});
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
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classData = await getAllClasses();
        setClasses(classData);
        const response = await getAllSessions();
        setSessions(response || []);
        const paymentData = await paymentService.getPaymentTypes();
        setPaymentTypes(paymentData);
        setFilteredPaymentTypes(paymentData);

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

  // Apply filters whenever search term, active filter, class filter, or payment types change
  useEffect(() => {
    let filtered = paymentTypes;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(pt => 
        pt.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply active status filter
    if (activeFilter !== 'all') {
      const isActive = activeFilter === 'active';
      filtered = filtered.filter(pt => pt.isActive === isActive);
    }
    
    // Apply class filter
    if (classFilter !== 'all') {
      filtered = filtered.filter(pt => pt.level === classFilter);
    }
    
    setFilteredPaymentTypes(filtered);
  }, [searchTerm, activeFilter, classFilter, paymentTypes]);

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
      
      {/* Search and Filter Section */}
      <div className="mb-6 bg-white p-4 rounded-md shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search by Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search by Name</label>
            <input
              type="text"
              placeholder="Search payment types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border rounded text-sm"
            />
          </div>
          
          {/* Filter by Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded text-sm bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          {/* Filter by Class */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Class</label>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded text-sm bg-white"
            >
              <option value="all">All Classes</option>
              {classes.map(cls => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredPaymentTypes.length} of {paymentTypes.length} payment types
      </div>

      <div className="overflow-x-auto shadow rounded-md">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Description</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Amount</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Due Date</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Class</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPaymentTypes.length > 0 ? (
              filteredPaymentTypes.map(pt => {
                const classObj = classes.find(c => c._id === pt.level);
                return (
                  <tr key={pt._id}>
                    <td className="px-4 text-[12px] py-3">{pt.name}</td>
                    <td className="px-4 text-[12px] py-3">{pt.description}</td>
                    <td className="px-4 text-[12px] py-3">₦{pt.amount.toLocaleString()}</td>
                    <td className="px-4 text-[12px] py-3">{new Date(pt.dueDate).toLocaleDateString()}</td>
                    <td className="px-4 text-[12px] py-3">{classObj ? classObj.name : 'N/A'}</td>
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
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-4 text-center text-sm text-gray-500">
                  No payment types found matching your criteria
                </td>
              </tr>
            )}
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
      <PaymentTypeFilter />
    </div>
  );
};

export default PaymentTypes;