import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    mobile: '',
    age: '',
    gender: 'Male',
    acc_no: '',
    bankId: 'bank1'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const result = await register(formData.bankId, {
      username: formData.username,
      password: formData.password,
      mobile: formData.mobile,
      age: parseInt(formData.age),
      gender: formData.gender,
      acc_no: formData.acc_no
    });

    if (result.success) {
      setSuccess('Registration successful! Please login to continue.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-200 rounded-full opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-secondary-200 rounded-full opacity-20 animate-bounce-gentle"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-primary-100 rounded-full opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-secondary-300 rounded-full opacity-20 animate-bounce-gentle"></div>
      </div>

      <div className="max-w-lg w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center animate-slide-down">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-success-600 to-success-800 rounded-2xl flex items-center justify-center shadow-glow-green animate-bounce-gentle">
            <span className="text-white text-2xl font-bold">👤</span>
          </div>
          <h2 className="mt-6 text-4xl font-bold font-display gradient-text">
            Create Account
          </h2>
          <p className="mt-2 text-lg text-secondary-600">
            Join our secure banking platform
          </p>
          <p className="mt-1 text-sm text-secondary-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-300"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Registration Form */}
        <div className="floating-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bank Selection */}
              <div className="md:col-span-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <label htmlFor="bankId" className="block text-sm font-semibold text-secondary-700 mb-2">
                  Select Bank
                </label>
                <select
                  id="bankId"
                  name="bankId"
                  value={formData.bankId}
                  onChange={handleChange}
                  className="input-field appearance-none cursor-pointer"
                  required
                >
                  <option value="bank1">🏦 Bank 1</option>
                  <option value="bank2">🏦 Bank 2</option>
                  <option value="bank3">🏦 Bank 3</option>
                </select>
              </div>

              {/* Account Number */}
              <div className="md:col-span-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <label htmlFor="acc_no" className="block text-sm font-semibold text-secondary-700 mb-2">
                  Account Number
                </label>
                <input
                  id="acc_no"
                  name="acc_no"
                  type="number"
                  required
                  value={formData.acc_no}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your account number"
                />
              </div>

              {/* Username */}
              <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <label htmlFor="username" className="block text-sm font-semibold text-secondary-700 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Choose a username"
                />
              </div>

              {/* Password */}
              <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <label htmlFor="password" className="block text-sm font-semibold text-secondary-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Create a password"
                />
              </div>

              {/* Mobile */}
              <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
                <label htmlFor="mobile" className="block text-sm font-semibold text-secondary-700 mb-2">
                  Mobile Number
                </label>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  required
                  value={formData.mobile}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter mobile number"
                />
              </div>

              {/* Age */}
              <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
                <label htmlFor="age" className="block text-sm font-semibold text-secondary-700 mb-2">
                  Age
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  required
                  min="18"
                  max="100"
                  value={formData.age}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your age"
                />
              </div>

              {/* Gender */}
              <div className="md:col-span-2 animate-slide-up" style={{ animationDelay: '0.7s' }}>
                <label htmlFor="gender" className="block text-sm font-semibold text-secondary-700 mb-2">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="input-field appearance-none cursor-pointer"
                  required
                >
                  <option value="Male">👨 Male</option>
                  <option value="Female">👩 Female</option>
                  <option value="Other">👤 Other</option>
                </select>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="animate-scale-in p-4 bg-danger-50 border border-danger-200 rounded-xl">
                <p className="text-sm font-medium text-danger-600">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="animate-scale-in p-4 bg-success-50 border border-success-200 rounded-xl">
                <p className="text-sm font-medium text-success-600">{success}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-success text-lg py-4"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-dots mr-3">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Security Features */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <div className="grid grid-cols-2 gap-4 text-xs text-secondary-500">
            <div className="flex items-center justify-center">
              <span className="mr-1 text-success-500">🛡️</span>
              Secure Registration
            </div>
            <div className="flex items-center justify-center">
              <span className="mr-1 text-primary-500">⚡</span>
              Instant Access
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
