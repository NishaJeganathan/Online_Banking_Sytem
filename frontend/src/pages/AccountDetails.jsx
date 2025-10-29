import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { bankingAPI } from '../services/api';

const AccountDetails = () => {
  const { accNo } = useParams();
  const { user } = useAuth();
  const [accountDetails, setAccountDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const response = await bankingAPI.getAccountDetails(user.bankId, accNo);
        setAccountDetails(response);
        
        // Fetch recent transactions
        const transactions = await bankingAPI.getTransactionHistory({
          bankId: user.bankId,
          acc_no: accNo,
          userId: user.user_id
        });
        
        // Get latest 3 transactions
        const allTransactions = [
          ...(transactions.sent || []),
          ...(transactions.received || [])
        ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        setRecentTransactions(allTransactions.slice(0, 3));
      } catch (err) {
        setError('Failed to load account details');
        console.error('Error fetching account details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (accNo && user) {
      fetchAccountDetails();
    }
  }, [accNo, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 font-medium">Loading account details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-danger-600 text-2xl">⚠️</span>
          </div>
          <div className="text-danger-600 text-xl mb-4">{error}</div>
          <Link to="/dashboard" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slide-down">
          <Link 
            to="/dashboard" 
            className="text-primary-600 hover:text-primary-700 font-medium mb-4 inline-flex items-center transition-colors duration-300"
          >
            <span className="mr-2">←</span>
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold font-display gradient-text">Account Details</h1>
          <p className="text-lg text-secondary-600 mt-2">
            Complete information about your account
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Account Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Header */}
            <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold font-display text-secondary-900">Account Information</h2>
                  <p className="text-secondary-600 mt-1">Account #{accNo}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowQRCode(!showQRCode)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <span className="text-lg">📱</span>
                    <span>QR Code</span>
                  </button>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-success-600 font-medium">Active</span>
                  </div>
                </div>
              </div>
              
              {/* QR Code Modal */}
              {showQRCode && (
                <div className="mb-6 p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-200">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-white rounded-xl mx-auto mb-4 flex items-center justify-center shadow-medium">
                      <div className="text-xs text-secondary-500 text-center">
                        <div className="font-mono">QR Code</div>
                        <div className="mt-2">Account: {accNo}</div>
                        <div>Bank: {user?.bankId?.toUpperCase()}</div>
                      </div>
                    </div>
                    <p className="text-sm text-secondary-600">Share this QR code for easy account identification</p>
                  </div>
                </div>
              )}
              
              {accountDetails ? (
                <div className="space-y-6">
                  {/* Balance Card */}
                  <div className="bg-gradient-to-r from-success-50 to-success-100 rounded-2xl p-6 border border-success-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-success-700 font-medium mb-1">Available Balance</p>
                        <p className="balance-display">
                          ₹{accountDetails.current_balance?.toLocaleString()}
                        </p>
                      </div>
                      <div className="w-16 h-16 bg-success-200 rounded-full flex items-center justify-center">
                        <span className="text-success-600 text-2xl">💰</span>
                      </div>
                    </div>
                  </div>

                  {/* Account Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-secondary-50 rounded-xl p-4">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-primary-600 text-sm">#</span>
                        </div>
                        <span className="text-sm font-medium text-secondary-600">Account Number</span>
                      </div>
                      <p className="text-lg font-bold text-secondary-900">{accountDetails.acc_no}</p>
                    </div>

                    <div className="bg-secondary-50 rounded-xl p-4">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-warning-600 text-sm">🏷️</span>
                        </div>
                        <span className="text-sm font-medium text-secondary-600">Account Type</span>
                      </div>
                      <p className="text-lg font-bold text-secondary-900 capitalize">{accountDetails.acc_type}</p>
                    </div>

                    <div className="bg-secondary-50 rounded-xl p-4">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-danger-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-danger-600 text-sm">💳</span>
                        </div>
                        <span className="text-sm font-medium text-secondary-600">Min Balance</span>
                      </div>
                      <p className="text-lg font-bold text-secondary-900">₹{accountDetails.min_balance?.toLocaleString()}</p>
                    </div>

                    <div className="bg-secondary-50 rounded-xl p-4">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-success-600 text-sm">📈</span>
                        </div>
                        <span className="text-sm font-medium text-secondary-600">Interest Rate</span>
                      </div>
                      <p className="text-lg font-bold text-secondary-900">{accountDetails.interest}%</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-secondary-600">No account details available</div>
                </div>
              )}
            </div>

            {/* Recent Transactions */}
            <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold font-display text-secondary-900">Recent Transactions</h2>
                <Link
                  to={`/transactions/${accNo}`}
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
                >
                  View All
                  <span className="ml-1">→</span>
                </Link>
              </div>
              
              {recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {recentTransactions.map((transaction, index) => (
                    <div key={transaction.transaction_id} className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors duration-200">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.amount > 0 ? 'bg-success-100' : 'bg-danger-100'
                        }`}>
                          <span className={`text-lg ${transaction.amount > 0 ? 'text-success-600' : 'text-danger-600'}`}>
                            {transaction.amount > 0 ? '↗️' : '↘️'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-secondary-900">
                            {transaction.amount > 0 ? 'Received from' : 'Sent to'} {transaction.recv_acc_no || transaction.sender_account}
                          </p>
                          <p className="text-xs text-secondary-500">
                            {new Date(transaction.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${transaction.amount > 0 ? 'text-success-600' : 'text-danger-600'}`}>
                          {transaction.amount > 0 ? '+' : '-'}₹{Math.abs(transaction.amount)?.toLocaleString()}
                        </p>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          transaction.status === 'completed' ? 'bg-success-100 text-success-800' :
                          transaction.status === 'pending' ? 'bg-warning-100 text-warning-800' :
                          'bg-danger-100 text-danger-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-secondary-400 text-xl">📋</span>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-secondary-900">No recent transactions</h3>
                  <p className="mt-1 text-sm text-secondary-500">
                    Your recent transaction history will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-xl font-bold font-display text-secondary-900 mb-6">Quick Actions</h2>
              <div className="space-y-4">
                <Link
                  to="/transfer"
                  className="w-full btn-primary text-center block flex items-center justify-center"
                >
                  <span className="mr-2">💸</span>
                  Transfer Money
                </Link>
                
                <Link
                  to={`/transactions/${accNo}`}
                  className="w-full btn-secondary text-center block flex items-center justify-center"
                >
                  <span className="mr-2">📋</span>
                  View Transaction History
                </Link>
                
                <Link
                  to="/dashboard"
                  className="w-full bg-secondary-200 hover:bg-secondary-300 text-secondary-800 font-medium py-3 px-4 rounded-xl transition-colors duration-200 text-center block flex items-center justify-center"
                >
                  <span className="mr-2">🏠</span>
                  Back to Dashboard
                </Link>
              </div>
            </div>

            {/* Account Status */}
            {accountDetails && (
              <div className="card animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <h2 className="text-xl font-bold font-display text-secondary-900 mb-6">Account Status</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-success-50 rounded-xl border border-success-200">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-success-600 text-sm">💰</span>
                      </div>
                      <div>
                        <p className="text-sm text-success-700 font-medium">Available Balance</p>
                        <p className="text-lg font-bold text-success-600">
                          ₹{accountDetails.current_balance?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl border border-primary-200">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-primary-600 text-sm">📈</span>
                      </div>
                      <div>
                        <p className="text-sm text-primary-700 font-medium">Interest Rate</p>
                        <p className="text-lg font-bold text-primary-600">{accountDetails.interest}%</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-warning-50 rounded-xl border border-warning-200">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-warning-600 text-sm">🏷️</span>
                      </div>
                      <div>
                        <p className="text-sm text-warning-700 font-medium">Account Type</p>
                        <p className="text-lg font-bold text-warning-600 capitalize">{accountDetails.acc_type}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
