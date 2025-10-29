import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { bankingAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [accountDetails, setAccountDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        // For demo purposes, we'll use a sample account number
        // In a real app, you'd get this from user's linked accounts
        const sampleAccNo = '1001'; // This should come from user's account data
        const response = await bankingAPI.getAccountDetails(user.bankId, sampleAccNo);
        setAccountDetails(response);
      } catch (err) {
        setError('Failed to load account details');
        console.error('Error fetching account details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAccountDetails();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8 animate-slide-down">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold font-display gradient-text">
                Welcome back, {user?.username}! 👋
              </h1>
              <p className="text-lg text-secondary-600 mt-2">
                Here's your account overview
              </p>
            </div>
            <div className="hidden lg:flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-secondary-500">Current Time</div>
                <div className="text-lg font-semibold text-secondary-800">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                <span className="text-primary-600 text-xl">🕐</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/transfer"
            className="card-hover group animate-slide-up"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-primary-600 text-lg">💸</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">
                  Transfer Money
                </h3>
                <p className="text-secondary-600 text-sm">Send money to other accounts</p>
              </div>
            </div>
          </Link>

          <Link
            to={`/transactions/${accountDetails?.acc_no || '1001'}`}
            className="card-hover group animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-success-600 text-lg">📋</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-secondary-900 group-hover:text-success-600 transition-colors">
                  Transaction History
                </h3>
                <p className="text-secondary-600 text-sm">View your transaction history</p>
              </div>
            </div>
          </Link>

          <Link
            to={`/account/${accountDetails?.acc_no || '1001'}`}
            className="card-hover group animate-slide-up"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-warning-600 text-lg">🏦</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-secondary-900 group-hover:text-warning-600 transition-colors">
                  Account Details
                </h3>
                <p className="text-secondary-600 text-sm">View account information</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Account Summary */}
          <div className="lg:col-span-2">
            <div className="card animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold font-display text-secondary-900">Account Summary</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-success-600 font-medium">Active</span>
                </div>
              </div>
              
              {error ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-danger-600 text-2xl">⚠️</span>
                  </div>
                  <p className="text-danger-600 font-medium">{error}</p>
                </div>
              ) : accountDetails ? (
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary-50 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-primary-600 text-sm">#</span>
                        </div>
                        <span className="text-sm font-medium text-secondary-600">Account Number</span>
                      </div>
                      <p className="text-lg font-bold text-secondary-900">{accountDetails.acc_no}</p>
                    </div>

                    <div className="bg-secondary-50 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-warning-600 text-sm">🏷️</span>
                        </div>
                        <span className="text-sm font-medium text-secondary-600">Account Type</span>
                      </div>
                      <p className="text-lg font-bold text-secondary-900 capitalize">{accountDetails.acc_type}</p>
                    </div>

                    <div className="bg-secondary-50 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-danger-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-danger-600 text-sm">💳</span>
                        </div>
                        <span className="text-sm font-medium text-secondary-600">Min Balance</span>
                      </div>
                      <p className="text-lg font-bold text-secondary-900">₹{accountDetails.min_balance?.toLocaleString()}</p>
                    </div>

                    <div className="bg-secondary-50 rounded-xl p-4">
                      <div className="flex items-center mb-2">
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
          </div>

          {/* User Information & Quick Stats */}
          <div className="space-y-6">
            {/* User Info Card */}
            <div className="card animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <h2 className="text-xl font-bold font-display text-secondary-900 mb-6">Profile Information</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-secondary-100">
                  <span className="text-secondary-600 font-medium">Username</span>
                  <span className="font-semibold text-secondary-900">{user?.username}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-secondary-100">
                  <span className="text-secondary-600 font-medium">Bank</span>
                  <span className="font-semibold text-primary-600">{user?.bankId?.toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-secondary-100">
                  <span className="text-secondary-600 font-medium">Mobile</span>
                  <span className="font-semibold text-secondary-900">{user?.mobile}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-secondary-100">
                  <span className="text-secondary-600 font-medium">Age</span>
                  <span className="font-semibold text-secondary-900">{user?.age}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-secondary-600 font-medium">Gender</span>
                  <span className="font-semibold text-secondary-900">{user?.gender}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <h2 className="text-xl font-bold font-display text-secondary-900 mb-6">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-primary-600 text-lg">✅</span>
                    </div>
                    <div>
                      <p className="text-sm text-secondary-600">Account Status</p>
                      <p className="font-semibold text-success-600">Active</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-success-600 text-lg">💰</span>
                    </div>
                    <div>
                      <p className="text-sm text-secondary-600">Balance</p>
                      <p className="font-semibold text-success-600">
                        ₹{accountDetails?.current_balance?.toLocaleString() || '0'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-warning-600 text-lg">📋</span>
                    </div>
                    <div>
                      <p className="text-sm text-secondary-600">Transactions</p>
                      <p className="font-semibold text-warning-600">View History</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
