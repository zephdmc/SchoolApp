import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {getStudentPaidPayment} from '../services/Paymentservices'
export default function PaymentDetails() {
  const { id } = useParams();
  const location = useLocation();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  // Extract query params from URL
  const queryParams = new URLSearchParams(location.search);
  const studentName = queryParams.get('name');
  const paymentTypeName = queryParams.get('type');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getStudentPaidPayment(id);
if (res.success) {
    setPayment(res.data);
    setLoading(false);

}
         } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Payment details not available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-xl max-w-lg w-full p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
          Payment Details
        </h2>

        <div className="space-y-4">
          <DetailRow label="Student" value={studentName} />
          <DetailRow label="Payment Type" value={paymentTypeName} />
          <DetailRow label="Amount" value={`₦${payment.amount.toLocaleString()}`} />
          <DetailRow label="Status" value={payment.status} status={payment.status} />
          <DetailRow label="Method" value={payment.paymentMethod} />
          <DetailRow label="Date Paid" value={new Date(payment.datePaid).toLocaleDateString()} />
          <DetailRow label="Reference" value={payment.reference} />
        </div>
      </div>
    </div>
  );
}

// Reusable row component
function DetailRow({ label, value, status }) {
  let statusClass = '';
  if (label === 'Status') {
    statusClass =
      value?.toLowerCase() === 'successful'
        ? 'text-green-600 font-semibold'
        : 'text-red-600 font-semibold';
  }

  return (
    <div className="flex justify-between border-b pb-2">
      <span className="text-gray-500">{label}:</span>
      <span className={`text-gray-800 ${statusClass}`}>{value}</span>
    </div>
  );
}
