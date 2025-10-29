import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { bankingAPI } from '../services/api';

const Transfer = () => {
  const { user } = useAuth();
  const [transferType, setTransferType] = useState('within');
  const [formData, setFormData] = useState({
    senderAccNo: '',
    receiverAccNo: '',
    amount: '',
    receiverBankId: 'bank1'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userAccounts, setUserAccounts] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [transferDetails, setTransferDetails] = useState(null);

  useEffect(() => {
    const fetchUserAccounts = async () => {
      try {
        const response = await bankingAPI.getUserAccounts(user.bankId, user.user_id);
        setUserAccounts(response);
      } catch (err) {
        console.error('Error fetching user accounts:', err);
      }
    };

    if (user) {
      fetchUserAccounts();
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.senderAccNo || !formData.receiverAccNo || !formData.amount) {
      setError('Please fill in all required fields');
      return false;
    }
    if (parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      return false;
    }
    if (formData.senderAccNo === formData.receiverAccNo) {
      setError('Sender and receiver accounts cannot be the same');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Show confirmation modal
    setTransferDetails({
      type: transferType,
      senderAccNo: formData.senderAccNo,
      receiverAccNo: formData.receiverAccNo,
      amount: parseFloat(formData.amount),
      receiverBankId: formData.receiverBankId
    });
    setShowConfirmModal(true);
  };

  const confirmTransfer = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    setShowConfirmModal(false);

    try {
      let result;
      
      if (transferType === 'within') {
        result = await bankingAPI.transferWithinBank({
          bankId: user.bankId,
          senderAccNo: formData.senderAccNo,
          receiverAccNo: formData.receiverAccNo,
          amount: parseFloat(formData.amount)
        });
      } else {
        result = await bankingAPI.transferToOtherBank({
          sender_bank_id: user.bankId,
          sender_acc: formData.senderAccNo,
          receiver_bank_id: formData.receiverBankId,
          receiver_acc: formData.receiverAccNo,
          amount: parseFloat(formData.amount)
        });
      }

      setSuccess(result.message || 'Transfer successful!');
      setFormData({
        senderAccNo: '',
        receiverAccNo: '',
        amount: '',
        receiverBankId: 'bank1'
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 animate-slide-down">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center shadow-glow mb-4">
            <span className="text-white text-2xl font-bold">💸</span>
          </div>
          <h1 className="text-4xl font-bold font-display gradient-text">Transfer Money</h1>
          <p className="text-lg text-secondary-600 mt-2">
            Send money to other accounts securely
          </p>
        </div>

        <div className="floating-card">
          {/* Transfer Type Selection */}
          <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-semibold text-secondary-700 mb-3">
              Transfer Type
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setTransferType('within')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  transferType === 'within'
                    ? 'bg-primary-600 text-white shadow-glow'
                    : 'bg-secondary-200 text-secondary-700 hover:bg-secondary-300'
                }`}
              >
                <span className="text-lg">🏦</span>
                <span>Within Bank</span>
              </button>
              <button
                type="button"
                onClick={() => setTransferType('other')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  transferType === 'other'
                    ? 'bg-primary-600 text-white shadow-glow'
                    : 'bg-secondary-200 text-secondary-700 hover:bg-secondary-300'
                }`}
              >
                <span className="text-lg">🏛️</span>
                <span>To Other Bank</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <label htmlFor="senderAccNo" className="block text-sm font-semibold text-secondary-700 mb-2">
                Your Account Number
              </label>
                <select
                  id="senderAccNo"
                  name="senderAccNo"
                  required
                  value={formData.senderAccNo}
                  onChange={handleChange}
                  className="input-field appearance-none cursor-pointer"
                >
                  <option value="">Select your account</option>
                  {userAccounts.map((account) => (
                    <option key={account.acc_no} value={account.acc_no}>
                      {account.acc_no} - ₹{account.current_balance?.toLocaleString()} ({account.acc_type})
                    </option>
                  ))}
                </select>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <label htmlFor="receiverAccNo" className="block text-sm font-semibold text-secondary-700 mb-2">
                Receiver Account Number
              </label>
                <input
                  type="number"
                  id="receiverAccNo"
                  name="receiverAccNo"
                  required
                  value={formData.receiverAccNo}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter receiver account number"
                />
            </div>

            {transferType === 'other' && (
              <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <label htmlFor="receiverBankId" className="block text-sm font-semibold text-secondary-700 mb-2">
                  Receiver Bank
                </label>
                  <select
                    id="receiverBankId"
                    name="receiverBankId"
                    value={formData.receiverBankId}
                    onChange={handleChange}
                    className="input-field appearance-none cursor-pointer"
                    required
                  >
                    <option value="bank1">🏦 Bank 1</option>
                    <option value="bank2">🏦 Bank 2</option>
                    <option value="bank3">🏦 Bank 3</option>
                  </select>
              </div>
            )}

            <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <label htmlFor="amount" className="block text-sm font-semibold text-secondary-700 mb-2">
                Amount (₹)
              </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  required
                  min="1"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter amount to transfer"
                />
            </div>

            {error && (
              <div className="animate-scale-in p-4 bg-danger-50 border border-danger-200 rounded-xl">
                <p className="text-sm font-medium text-danger-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="animate-scale-in p-4 bg-success-50 border border-success-200 rounded-xl">
                <p className="text-sm font-medium text-success-600">{success}</p>
              </div>
            )}

            <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary text-lg py-4"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-dots mr-3">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    Processing...
                  </div>
                ) : (
                  'Transfer Money'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Transfer Info */}
        <div className="mt-8 card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Transfer Information</h3>
          <div className="space-y-2 text-sm text-secondary-600">
            <p>• Within Bank transfers are processed immediately</p>
            <p>• Inter-bank transfers require admin approval and may take longer</p>
            <p>• Ensure you have sufficient balance before initiating transfer</p>
            <p>• Double-check account numbers before confirming</p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 animate-scale-in">
            <div className="text-center mb-6">
              <div className="mx-auto h-16 w-16 bg-warning-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-warning-600 text-2xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-2">Confirm Transfer</h3>
              <p className="text-secondary-600">Please review the transfer details before confirming</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-secondary-50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-secondary-600">Transfer Type:</span>
                  <span className="text-sm font-semibold text-secondary-900 capitalize">
                    {transferDetails?.type === 'within' ? 'Within Bank' : 'To Other Bank'}
                  </span>
                </div>
              </div>
              
              <div className="bg-secondary-50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-secondary-600">From Account:</span>
                  <span className="text-sm font-semibold text-secondary-900">{transferDetails?.senderAccNo}</span>
                </div>
              </div>
              
              <div className="bg-secondary-50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-secondary-600">To Account:</span>
                  <span className="text-sm font-semibold text-secondary-900">{transferDetails?.receiverAccNo}</span>
                </div>
              </div>
              
              {transferDetails?.type === 'other' && (
                <div className="bg-secondary-50 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-secondary-600">To Bank:</span>
                    <span className="text-sm font-semibold text-secondary-900 capitalize">
                      {transferDetails?.receiverBankId?.replace('bank', 'Bank ')}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="bg-primary-50 rounded-xl p-4 border border-primary-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-primary-700">Amount:</span>
                  <span className="text-lg font-bold text-primary-600">₹{transferDetails?.amount?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-secondary-200 hover:bg-secondary-300 text-secondary-800 font-medium py-3 px-4 rounded-xl transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmTransfer}
                disabled={loading}
                className="flex-1 btn-primary"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-dots mr-2">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    Processing...
                  </div>
                ) : (
                  'Confirm Transfer'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transfer;
