import React, { useState, useEffect } from 'react';
import { Table, Form, Alert, Card } from 'react-bootstrap';
import paymentService from '../../services/api';
import { useSelector } from 'react-redux';

const PaymentsList = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [filters, setFilters] = useState({
    paymentType: '',
    status: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { userInfo } = useSelector(state => state.auth);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [paymentsData, typesData] = await Promise.all([
          paymentService.getAllPayments({}, userInfo.token),
          paymentService.getPaymentTypes(userInfo.token)
        ]);
        
        setPayments(paymentsData);
        setFilteredPayments(paymentsData);
        setPaymentTypes(typesData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userInfo.token]);

  useEffect(() => {
    let result = [...payments];
    
    if (filters.paymentType) {
      result = result.filter(p => p.paymentType._id === filters.paymentType);
    }
    
    if (filters.status) {
      result = result.filter(p => p.status === filters.status);
    }
    
    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      
      result = result.filter(p => {
        const paymentDate = new Date(p.createdAt);
        return paymentDate >= start && paymentDate <= end;
      });
    }
    
    setFilteredPayments(result);
  }, [filters, payments]);

  const calculateTotal = () => {
    return filteredPayments
      .filter(p => p.status === 'successful')
      .reduce((sum, p) => sum + p.amount, 0);
  };

  return (
    <div className="container mt-4">
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Payments Summary</Card.Title>
          <Card.Text>
            Total Payments: {filteredPayments.length} | 
            Total Amount: {calculateTotal().toLocaleString()}
          </Card.Text>
        </Card.Body>
      </Card>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <div className="mb-4 p-3 border rounded">
        <h5>Filters</h5>
        <Form>
          <div className="row">
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>Payment Type</Form.Label>
                <Form.Select
                  value={filters.paymentType}
                  onChange={(e) => setFilters({...filters, paymentType: e.target.value})}
                >
                  <option value="">All Types</option>
                  {paymentTypes.map(pt => (
                    <option key={pt._id} value={pt._id}>{pt.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
            
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="successful">Successful</option>
                  <option value="failed">Failed</option>
                </Form.Select>
              </Form.Group>
            </div>
            
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>From Date</Form.Label>
                <Form.Control
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                />
              </Form.Group>
            </div>
            
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>To Date</Form.Label>
                <Form.Control
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                />
              </Form.Group>
            </div>
          </div>
        </Form>
      </div>
      
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Student</th>
              <th>Payment Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Reference</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map(payment => (
              <tr key={payment._id}>
                <td>{payment.student?.name || 'N/A'}</td>
                <td>{payment.paymentType?.name || 'N/A'}</td>
                <td>{payment.amount.toLocaleString()}</td>
                <td className={`text-${payment.status === 'successful' ? 'success' : payment.status === 'failed' ? 'danger' : 'warning'}`}>
                  {payment.status}
                </td>
                <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                <td>{payment.reference}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default PaymentsList;