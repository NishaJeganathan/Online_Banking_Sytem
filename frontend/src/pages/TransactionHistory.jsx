import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { bankingAPI } from '../services/api';

const TransactionHistory = () => {
  const { accNo } = useParams();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await bankingAPI.getTransactionHistory({
          bankId: user.bankId,
          acc_no: accNo,
          userId: user.user_id
        });
        setTransactions(response);
      } catch (err) {
        setError('Failed to load transaction history');
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    if (accNo && user) {
      fetchTransactions();
    }
  }, [accNo, user]);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success-100 text-success-800';
      case 'pending':
        return 'bg-warning-100 text-warning-800';
      case 'failed':
        return 'bg-danger-100 text-danger-800';
      default:
        return 'bg-secondary-100 text-secondary-800';
    }
  };

  const getAllTransactions = () => {
    if (!transactions) return [];
    const allTransactions = [
      ...(transactions.sent || []).map(t => ({ ...t, type: 'sent' })),
      ...(transactions.received || []).map(t => ({ ...t, type: 'received' }))
    ];
    
    // Filter by type
    let filtered = allTransactions;
    if (filterType !== 'all') {
      filtered = allTransactions.filter(t => t.type === filterType);
    }
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.transaction_id.toString().includes(searchTerm) ||
        (t.recv_acc_no && t.recv_acc_no.toString().includes(searchTerm)) ||
        (t.sender_account && t.sender_account.toString().includes(searchTerm)) ||
        t.amount.toString().includes(searchTerm)
      );
    }
    
    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return Math.abs(b.amount) - Math.abs(a.amount);
        case 'date':
        default:
          return new Date(b.timestamp) - new Date(a.timestamp);
      }
    });
    
    return filtered;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <Link to="/dashboard" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slide-down">
          <Link 
            to="/dashboard" 
            className="text-primary-600 hover:text-primary-700 font-medium mb-4 inline-flex items-center transition-colors duration-300"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold font-display gradient-text">Transaction History</h1>
              <p className="text-lg text-secondary-600 mt-2">
                Account Number: {accNo}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-success-600 font-medium">Live Updates</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filterType === 'all' 
                    ? 'bg-primary-600 text-white shadow-glow' 
                    : 'bg-secondary-200 text-secondary-700 hover:bg-secondary-300'
                }`}
              >
                All Transactions
              </button>
              <button
                onClick={() => setFilterType('sent')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filterType === 'sent' 
                    ? 'bg-danger-600 text-white shadow-glow' 
                    : 'bg-secondary-200 text-secondary-700 hover:bg-secondary-300'
                }`}
              >
                Money Sent
              </button>
              <button
                onClick={() => setFilterType('received')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filterType === 'received' 
                    ? 'bg-success-600 text-white shadow-glow' 
                    : 'bg-secondary-200 text-secondary-700 hover:bg-secondary-300'
                }`}
              >
                Money Received
              </button>
            </div>

            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10 w-full sm:w-64"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="w-4 h-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field appearance-none cursor-pointer pr-8"
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
              </select>
            </div>
          </div>
        </div>

        {transactions ? (
          <div className="space-y-6">
            {/* Transaction Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="card bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary-700">Total Transactions</p>
                    <p className="text-2xl font-bold text-primary-600">
                      {getAllTransactions().length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="card bg-gradient-to-r from-danger-50 to-danger-100 border-danger-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-danger-700">Money Sent</p>
                    <p className="text-2xl font-bold text-danger-600">
                      ₹{getAllTransactions().filter(t => t.type === 'sent').reduce((sum, t) => sum + Math.abs(t.amount), 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-danger-200 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="card bg-gradient-to-r from-success-50 to-success-100 border-success-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-success-700">Money Received</p>
                    <p className="text-2xl font-bold text-success-600">
                      ₹{getAllTransactions().filter(t => t.type === 'received').reduce((sum, t) => sum + Math.abs(t.amount), 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-success-200 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5l9 2-9 18-9-18 9-2zm0 0v8" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions List */}
            {getAllTransactions().length > 0 ? (
              <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-secondary-200">
                    <thead className="bg-secondary-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                          Transaction
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                          Account
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                          Bank
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-secondary-200">
                      {getAllTransactions().map((transaction) => (
                        <tr key={transaction.transaction_id} className="hover:bg-secondary-50 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                                transaction.type === 'sent' ? 'bg-danger-100' : 'bg-success-100'
                              }`}>
                                <svg className={`w-5 h-5 ${transaction.type === 'sent' ? 'text-danger-600' : 'text-success-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  {transaction.type === 'sent' ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                  ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5l9 2-9 18-9-18 9-2zm0 0v8" />
                                  )}
                                </svg>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-secondary-900">
                                  #{transaction.transaction_id}
                                </div>
                                <div className="text-xs text-secondary-500">
                                  {transaction.type === 'sent' ? 'Outgoing' : 'Incoming'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              transaction.type === 'sent' ? 'bg-danger-100 text-danger-800' : 'bg-success-100 text-success-800'
                            }`}>
                              {transaction.type === 'sent' ? 'Sent' : 'Received'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                            {transaction.type === 'sent' ? transaction.recv_acc_no : transaction.sender_account}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                            {transaction.type === 'sent' ? transaction.recv_bank?.toUpperCase() : transaction.sender_bank?.toUpperCase()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                            <span className={transaction.type === 'sent' ? 'text-danger-600' : 'text-success-600'}>
                              {transaction.type === 'sent' ? '-' : '+'}₹{transaction.amount?.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                            {formatDate(transaction.timestamp)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                              {transaction.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="card text-center py-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <svg className="mx-auto h-12 w-12 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-secondary-900">No transactions found</h3>
                <p className="mt-1 text-sm text-secondary-500">
                  {searchTerm || filterType !== 'all' 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'No transaction history found for this account.'}
                </p>
                <div className="mt-6">
                  <Link to="/transfer" className="btn-primary">
                    Make a Transfer
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="text-secondary-600">No transaction data available</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
