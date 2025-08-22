import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table, Card, Statistic, Button, Modal, Form, Input, InputNumber, 
  Select, DatePicker, Tag, Space, Divider, Tabs, message, Popconfirm 
} from 'antd';
import moment from 'moment';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
// Add this line to properly import Search
const { Search } = Input;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const AdminWalletDashboard = () => {
  // State for all tabs
  const [activeTab, setActiveTab] = useState('wallets');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('adjust');
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [form] = Form.useForm();

  // Wallets tab state
  const [wallets, setWallets] = useState([]);
  const [walletsPagination, setWalletsPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [walletsFilters, setWalletsFilters] = useState({
    sortBy: 'createdAt',
    sortOrder: 'desc',
    minBalance: '',
    maxBalance: ''
  });

  // Transactions tab state
  const [transactions, setTransactions] = useState([]);
  const [transactionsPagination, setTransactionsPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [transactionsFilters, setTransactionsFilters] = useState({
    type: '',
    status: '',
    dateRange: [],
    studentId: ''
  });

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === 'wallets') {
      fetchWallets();
    } else if (activeTab === 'transactions') {
      fetchTransactions();
    }
  }, [activeTab, walletsFilters, walletsPagination.current, transactionsFilters, transactionsPagination.current]);

  // Data fetching functions
  const fetchWallets = async () => {
    setLoading(true);
    try {
      const { current, pageSize } = walletsPagination;
      const queryParams = {
        ...walletsFilters,
        page: current,
        limit: pageSize
      };
      
      const response = await axios.get('/fee/api/wallet/admin/all', { params: queryParams });
      setWallets(response.data);
      setWalletsPagination({
        ...walletsPagination,
        total: response.headers['x-total-count'] || 0
      });
    } catch (error) {
      message.error('Failed to fetch wallets');
    } finally {
      setLoading(false);
    }
  };

 
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const params = {
          type: transactionsFilters.type,
          status: transactionsFilters.status,
          startDate: transactionsFilters.dateRange[0]?.format('YYYY-MM-DD'),
          endDate: transactionsFilters.dateRange[1]?.format('YYYY-MM-DD'),
          page: transactionsPagination.current,
          limit: transactionsPagination.pageSize
        };
    
        // Handle admission number search differently
        if (transactionsFilters.studentId) {
          // Check if it's an admission number (not an ObjectId)
          if (!/^[0-9a-fA-F]{24}$/.test(transactionsFilters.studentId)) {
            params.admissionNumber = transactionsFilters.studentId;
          } else {
            params.studentId = transactionsFilters.studentId;
          }
        }
    
        // Remove undefined parameters
        Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
        
        const response = await axios.get('/fee/api/wallet/admin/transactions', { params });
        setTransactions(response.data);
        setTransactionsPagination({
          ...transactionsPagination,
          total: response.headers['x-total-count'] || 0
        });
      } catch (error) {
        message.error('Failed to fetch transactions');
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    

  const fetchWalletDetails = async (studentId) => {
    try {
      const response = await axios.get(`/fee/api/wallet/admin/student/${studentId}`);
      return response.data;
    } catch (error) {
      message.error('Failed to fetch wallet details');
      return null;
    }
  };

  // Modal handlers
  const showModal = (type, wallet = null) => {
    setModalType(type);
    setSelectedWallet(wallet);
    
    if (type === 'adjust' && wallet) {
      form.setFieldsValue({
        studentId: wallet.student.studentID        ,
        studentName: `${wallet.student.firstName} ${wallet.student.lastName}`
      });
    }
    
    setModalVisible(true);
  };

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (modalType === 'adjust') {
        await axios.post(`/fee/api/wallet/admin/adjust/${values.studentId}`, {
          type: values.type,
          amount: values.amount,
          description: values.description
        });
        message.success('Wallet balance adjusted successfully');
      }
      
      setModalVisible(false);
      form.resetFields();
      
      // Refresh data based on active tab
      if (activeTab === 'wallets') {
        fetchWallets();
      } else {
        fetchTransactions();
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Operation failed');
    }
  };

  // Filter handlers
  const handleWalletsFilterChange = (name, value) => {
    setWalletsFilters(prev => ({ ...prev, [name]: value }));
    setWalletsPagination({ ...walletsPagination, current: 1 });
  };


  // Update your filter handlers to include student name
const handleTransactionsFilterChange = (name, value) => {
  // If filtering by type or status, reset pagination
  if (name === 'type' || name === 'status') {
    setTransactionsPagination(prev => ({ ...prev, current: 1 }));
  }
  setTransactionsFilters(prev => ({ ...prev, [name]: value }));
};

  // Table columns
  const walletColumns = [
    {
      title: 'Student',
      dataIndex: ['student', 'fullName'],
      render: (_, record) => (
        <Button 
          type="link" 
          onClick={() => showModal('details', record)}
          style={{ padding: 0 }}
        >
          {record.student.firstName} {record.student.lastName}
        </Button>
      ),
      sorter: true
    },
    {
      title: 'Admission No.',
      dataIndex: ['student', 'admissionNumber'],
      sorter: true
    },
    {
      title: 'Balance (₦)',
      dataIndex: 'balance',
      render: balance => (
        <span style={{ fontWeight: 'bold' }}>
          ₦{parseFloat(balance).toLocaleString()}
        </span>
      ),
      sorter: true
    },
    {
      title: 'Transactions',
      dataIndex: 'transactions',
      render: transactions => transactions.length
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      render: date => moment(date).format('DD/MM/YYYY'),
      sorter: true
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => showModal('adjust', record)}
          >
            Adjust
          </Button>
        </Space>
      )
    }
  ];

  const transactionColumns = [
    {
      title: 'Student',
      render: (_, record) => {
        const student = record.wallet?.student;
        if (!student || student.error) return 'Unknown Student';
        
        const name = student.fullName || `${student.firstName} ${student.lastName}`;
        return (
          // <Button 
          //   type="link" 
          //   onClick={() => showModal('details', record.wallet)}
          //   style={{ padding: 0 }}
          // >
          //   {name}
          // </Button>
           <p 
          //  type="link" 
          //  onClick={() => showModal('details', record.wallet)}
           style={{ padding: 0 }}
         >
           {name}
         </p>
        );
      },
      // Add filter for student name
      filteredValue: transactionsFilters.studentName ? [transactionsFilters.studentName] : null,
      onFilter: (value, record) => {
        const student = record.wallet?.student;
        if (!student) return false;
        const fullName = student.fullName || `${student.firstName} ${student.lastName}`;
        return fullName.toLowerCase().includes(value.toLowerCase());
      }
    },
    {
      title: 'Admission No.',
      render: (_, record) => {
        const student = record.wallet?.student;
        return student?.admissionNumber || 'N/A';
      },
      // Add filter for admission number
      filteredValue: transactionsFilters.admissionNumber ? [transactionsFilters.admissionNumber] : null,
      onFilter: (value, record) => {
        const student = record.wallet?.student;
        return student?.admissionNumber?.includes(value) || false;
      }
    },
    
    {
      title: 'Description',
      dataIndex: 'description',
      ellipsis: true
    },
    {
      title: 'Type',
      dataIndex: 'type',
      render: type => (
        <Tag color={type === 'credit' ? 'green' : 'red'}>
          {type.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Credit', value: 'credit' },
        { text: 'Debit', value: 'debit' }
      ],
      filteredValue: transactionsFilters.type ? [transactionsFilters.type] : null
    },
    {
      title: 'Amount (₦)',
      dataIndex: 'amount',
      render: (amount, record) => (
        <span style={{ 
          color: record.type === 'credit' ? 'green' : 'red',
          fontWeight: 'bold'
        }}>
          {record.type === 'credit' ? '+' : '-'}₦{parseFloat(amount).toLocaleString()}
        </span>
      ),
      sorter: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: status => (
        <Tag 
          color={
            status === 'successful' ? 'green' : 
            status === 'failed' ? 'red' : 'orange'
          }
        >
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Successful', value: 'successful' },
        { text: 'Pending', value: 'pending' },
        { text: 'Failed', value: 'failed' }
      ],
      filteredValue: transactionsFilters.status ? [transactionsFilters.status] : null
    }
  ];

  // Modal content based on type
  const renderModalContent = () => {
    switch (modalType) {
      case 'adjust':
        return (
          <Form form={form} layout="vertical">
            <Form.Item name="studentId" label="Student ID" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="studentName" label="Student">
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="type"
              label="Transaction Type"
              rules={[{ required: true, message: 'Please select type' }]}
            >
              <Select>
                <Option value="credit">Credit (Add Funds)</Option>
                <Option value="debit">Debit (Deduct Funds)</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="amount"
              label="Amount (₦)"
              rules={[
                { required: true, message: 'Please enter amount' },
                { type: 'number', min: 1, message: 'Amount must be positive' }
              ]}
            >
              <InputNumber 
                style={{ width: '100%' }} 
                min={1} 
                step={100} 
                formatter={value => `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please enter description' }]}
            >
              <TextArea rows={3} />
            </Form.Item>
          </Form>
        );
      case 'details':
        return selectedWallet ? (
          <div>
            <Card>
              <Statistic
                title="Current Balance"
                value={selectedWallet.balance}
                precision={2}
                prefix="₦"
                valueStyle={{ color: selectedWallet.balance >= 0 ? '#3f8600' : '#cf1322' }}
              />
            </Card>
            <Divider />
            <h4>Recent Transactions</h4>
            <Table
              columns={transactionColumns.filter(col => !['Student', 'Admission No.'].includes(col.title))}
              dataSource={selectedWallet.transactions.slice(0, 5)}
              rowKey="_id"
              pagination={false}
              size="small"
            />
          </div>
        ) : (
          <p>Loading wallet details...</p>
        );
      default:
        return null;
    }
  };

  return (
    <div className="wallet-management-dashboard">
      <Card 
        title="Wallet Management System" 
        extra={
          <Button 
            icon={<ReloadOutlined />} 
            onClick={activeTab === 'wallets' ? fetchWallets : fetchTransactions}
            loading={loading}
          >
            Refresh
          </Button>
        }
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Student Wallets" key="wallets">
            <div className="filters-container">
              <Space size="large" wrap>
                <div className="filter-group">
                  <span>Balance Range: </span>
                  <InputNumber
                    placeholder="Min"
                    style={{ width: 120 }}
                    onChange={value => handleWalletsFilterChange('minBalance', value)}
                    formatter={value => `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  />
                  <span style={{ margin: '0 8px' }}>-</span>
                  <InputNumber
                    placeholder="Max"
                    style={{ width: 120 }}
                    onChange={value => handleWalletsFilterChange('maxBalance', value)}
                    formatter={value => `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  />
                </div>
                
              
              </Space>
            </div>
            
            <Table
              columns={walletColumns}
              dataSource={wallets}
              rowKey="_id"
              pagination={walletsPagination}
              loading={loading}
              onChange={(pagination, _, sorter) => {
                setWalletsPagination(pagination);
                if (sorter.field) {
                  handleWalletsFilterChange('sortBy', sorter.field);
                  handleWalletsFilterChange('sortOrder', sorter.order === 'ascend' ? 'asc' : 'desc');
                }
              }}
              scroll={{ x: true }}
            />
          </TabPane>
          
          <TabPane tab="All Transactions" key="transactions">
       

<div className="filters-container">
  <Space size="large" wrap>
    <Select
      placeholder="Transaction Type"
      style={{ width: 100 }}
      allowClear
      onChange={value => handleTransactionsFilterChange('type', value)}
      value={transactionsFilters.type}
    >
      <Option value="credit">Credit</Option>
      <Option value="debit">Debit</Option>
    </Select>
    
    <Select
      placeholder="Transaction Status"
      style={{ width: 150 }}
      allowClear
      onChange={value => handleTransactionsFilterChange('status', value)}
      value={transactionsFilters.status}
    >
      <Option value="successful">Successful</Option>
      <Option value="pending">Pending</Option>
      <Option value="failed">Failed</Option>
    </Select>
    
    <RangePicker
      onChange={dates => handleTransactionsFilterChange('dateRange', dates)}
      value={transactionsFilters.dateRange}
    />
    
    <Search
      placeholder="Search by student name"
      allowClear
      enterButton={<SearchOutlined />}
      onSearch={value => handleTransactionsFilterChange('studentName', value)}
      style={{ width: 250 }}
    />
    
     </Space>
</div>
            
            <Table
              columns={transactionColumns}
              dataSource={transactions}
              rowKey="_id"
              pagination={transactionsPagination}
              loading={loading}
              onChange={(pagination) => setTransactionsPagination(pagination)}
              scroll={{ x: true }}
            />
          </TabPane>
        </Tabs>
      </Card>
      
      {/* Modal for various operations */}
      <Modal
        title={
          modalType === 'adjust' ? 'Adjust Wallet Balance' : 
          modalType === 'details' ? 'Wallet Details' : ''
        }
        visible={modalVisible}
        onOk={handleModalSubmit}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        confirmLoading={loading}
        width={modalType === 'details' ? 800 : 600}
        footer={
          modalType === 'adjust' ? [
            <Button key="cancel" onClick={() => setModalVisible(false)}>
              Cancel
            </Button>,
            <Button 
              key="submit" 
              type="primary" 
              onClick={handleModalSubmit}
              loading={loading}
            >
              Submit Adjustment
            </Button>
          ] : null
        }
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
};

export default AdminWalletDashboard;