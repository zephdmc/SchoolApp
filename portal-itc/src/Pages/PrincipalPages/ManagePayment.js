import React, { useState, useEffect } from 'react';
import paymentService from '../../services/Paymentservices';
import {getAllClasses} from '../../services/ClassService'; // corrected import path
import { getAllSessions } from "../../services/SessionService";

const PaymentTypes = () => {
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [showModal, setShowModal] = useState(false);
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
      setFormData({
        name: '',
        description: '',
        amount: '',
        dueDate: '',
        academicSession: '',
        level: ''
      });
    } catch (err) {
      setError(err.message);
    }
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

      <div className="overflow-x-auto shadow rounded-md">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Description</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Amount</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Due Date</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paymentTypes.map(pt => (
              <tr key={pt._id}>
                <td className="px-4 py-3">{pt.name}</td>
                <td className="px-4 py-3">{pt.description}</td>
                <td className="px-4 py-3">₦{pt.amount.toLocaleString()}</td>
                <td className="px-4 py-3">{new Date(pt.dueDate).toLocaleDateString()}</td>
                <td className="px-4 py-3">{pt.isActive ? 'Active' : 'Inactive'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
    </div>
  );
};

export default PaymentTypes;
