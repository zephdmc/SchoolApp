import React, { useState, useEffect, useMemo } from "react";
import {
  getPaymentsByPaymentType,
} from "../../../services/Paymentservices";
 
import paymentService from "../../../services/Paymentservices";
const PaymentTypeFilter = () => {
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState("");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState({});
  const [selectedPaymentTypeInfo, setSelectedPaymentTypeInfo] = useState(null);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  // Fetch payment types
  useEffect(() => {
    const fetchPaymentTypes = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await paymentService.getPaymentTypes();
        setPaymentTypes(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to fetch payment types");
        console.error("Payment types fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentTypes();
  }, []);

  // Fetch payments when type or filters change
  useEffect(() => {
    if (!selectedPaymentType) return;

    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getPaymentsByPaymentType(
          selectedPaymentType,
          filters
        );

        // ✅ Normalize response
        let paymentsData = [];
        let paymentTypeInfo = null;
        let paginationData = {};

        if (Array.isArray(response)) {
          paymentsData = response;
        } else if (response?.payments) {
          paymentsData = response.payments;
          paymentTypeInfo = response.paymentType;
          paginationData = response.pagination || {};
        } else if (response?.data?.payments) {
          paymentsData = response.data.payments;
          paymentTypeInfo = response.data.paymentType;
          paginationData = response.data.pagination || {};
        }

        setPayments(paymentsData);
        setSelectedPaymentTypeInfo(paymentTypeInfo);
        setPagination(paginationData);
      } catch (err) {
        setError("Failed to fetch payments");
        console.error("Payments fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [selectedPaymentType, filters]);

  const handlePaymentTypeChange = (e) => {
    setSelectedPaymentType(e.target.value);
    setSelectedPaymentTypeInfo(null);
    setPayments([]);
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const handleStatusChange = (e) => {
    setFilters((prev) => ({ ...prev, status: e.target.value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount || 0);

  const getStudentName = (payment) =>
    payment.student?.name || payment.studentName || "N/A";

  const getStudentId = (payment) =>
    payment.student?.admissionNumber ||
    payment.studentId ||
    payment.student?.studentID ||
    "N/A";

  // ✅ Apply filters (search + date range)
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const name = getStudentName(p).toLowerCase();
      const id = getStudentId(p).toLowerCase();
      const searchMatch =
        !search ||
        name.includes(search.toLowerCase()) ||
        id.includes(search.toLowerCase());

      const datePaid = new Date(p.datePaid || p.createdAt);
      const from = dateRange.from ? new Date(dateRange.from) : null;
      const to = dateRange.to ? new Date(dateRange.to) : null;

      const dateMatch =
        (!from || datePaid >= from) && (!to || datePaid <= to);

      return searchMatch && dateMatch;
    });
  }, [payments, search, dateRange]);

  // ✅ Calculate total
  const totalAmount = useMemo(() => {
    return filteredPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  }, [filteredPayments]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Payment Type Filter
      </h2>

      {/* Filters Section */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {/* Payment Type */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Select Payment Type
          </label>
          <select
            value={selectedPaymentType}
            onChange={handlePaymentTypeChange}
            disabled={loading}
            className="w-full border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
          >
            <option value="">-- Select --</option>
            {paymentTypes.map((type) => (
              <option key={type._id} value={type._id}>
                {type.name} - {formatCurrency(type.amount)}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Filter by Status
          </label>
          <select
            value={filters.status}
            onChange={handleStatusChange}
            disabled={loading}
            className="w-full border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="successful">Successful</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Search */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Search Student
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Enter name or ID..."
            className="w-full border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
          />
        </div>
      </div>

      {/* Date Range */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">From</label>
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, from: e.target.value }))
            }
            className="w-full border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">To</label>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, to: e.target.value }))
            }
            className="w-full border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
          />
        </div>
      </div>

      {/* Info */}
      {selectedPaymentTypeInfo && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-blue-700">
            {selectedPaymentTypeInfo.name}
          </h3>
          <p className="text-gray-600">
            Amount: {formatCurrency(selectedPaymentTypeInfo.amount)}
          </p>
          {selectedPaymentTypeInfo.description && (
            <p className="text-gray-500">{selectedPaymentTypeInfo.description}</p>
          )}
        </div>
      )}

      {/* Loading / Error */}
      {loading && <div className="text-blue-500">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {/* Table or Cards */}
      {selectedPaymentType && filteredPayments.length > 0 && (
        <div className="overflow-x-auto">
          <div className="flex justify-between items-center mb-3">
            <p className="text-gray-700 font-medium">
              Total: {formatCurrency(totalAmount)}
            </p>
            <p className="text-sm text-gray-500">
              Showing {filteredPayments.length} payments
            </p>
          </div>

          <table className="min-w-full bg-white border rounded-lg shadow-md hidden md:table">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-3 text-left">Student Name</th>
                <th className="py-2 px-3 text-left">Student ID</th>
                <th className="py-2 px-3 text-left">Amount</th>
                <th className="py-2 px-3 text-left">Status</th>
                <th className="py-2 px-3 text-left">Method</th>
                <th className="py-2 px-3 text-left">Date</th>
                <th className="py-2 px-3 text-left">Reference</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="py-2 px-3">{getStudentName(p)}</td>
                  <td className="py-2 px-3">{getStudentId(p)}</td>
                  <td className="py-2 px-3">{formatCurrency(p.amount)}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        p.status === "successful"
                          ? "bg-green-100 text-green-700"
                          : p.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-2 px-3">{p.paymentMethod || "N/A"}</td>
                  <td className="py-2 px-3">
                    {formatDate(p.datePaid || p.createdAt)}
                  </td>
                  <td className="py-2 px-3">{p.reference || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className="grid gap-4 md:hidden">
            {filteredPayments.map((p) => (
              <div
                key={p._id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <p className="font-semibold">{getStudentName(p)}</p>
                <p className="text-sm text-gray-500">
                  ID: {getStudentId(p)} | {formatCurrency(p.amount)}
                </p>
                <p className="text-sm text-gray-600">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      p.status === "successful"
                        ? "text-green-600"
                        : p.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {p.status}
                  </span>
                </p>
                <p className="text-sm">
                  Date: {formatDate(p.datePaid || p.createdAt)}
                </p>
                <p className="text-xs text-gray-400">
                  Ref: {p.reference || "N/A"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {selectedPaymentType && !loading && filteredPayments.length === 0 && (
        <div className="text-gray-500 text-center py-6">
          No payments found for the selected criteria.
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-3">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1 || loading}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages || loading}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentTypeFilter;
