import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resetToken, setResetToken] = useState(''); // Store the reset token
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login.');
    }
    setLoading(false);
  };
  // Handle OTP request
  const handleSendOtp = async () => {
    if (!email) return alert('Please enter your email.');
    try {
      const response = await fetch('http://localhost:5000/api/request-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setOtpSent(true);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to send verification code. Please try again.');
      }
    } catch (error) {
      console.error('OTP error:', error);
      alert('An error occurred while requesting verification code.');
    }
  };

  // Handle OTP Verification
  const handleVerifyOtp = async () => {
    if (!otp) return alert('Please enter the verification code.');
    try {
      const response = await fetch('http://localhost:5000/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      if (response.ok) {
        const data = await response.json();
        setResetToken(data.resetToken); // Store the reset token
        alert('Verification successful! You can now reset your password.');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Invalid or expired verification code. Please try again.');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      alert('An error occurred during verification.');
    }
  };

  // Handle Password Reset
  const handleResetPassword = async () => {
    if (!newPassword) return alert('Please enter your new password.');
    try {
      const response = await fetch('http://localhost:5000/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: newPassword, resetToken }),
      });
      if (response.ok) {
        alert('Password reset successfully! You can now log in with your new password.');
        setForgotPassword(false); // Go back to login form
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      alert('An error occurred while resetting your password.');
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-red-700 to-white">
      <div className="w-1/2 bg-red-700 text-white flex flex-col justify-center items-center p-12">
        <div className="max-w-xs text-center">
          <img src="/logo.png" alt="Logo" className="w-20 mb-6" />
          <h2 className="text-4xl font-extrabold text-white mb-4">Addis Music Awards</h2>
          <p className="text-lg text-white opacity-80 mb-4">
            Vote for your favorite nominees and celebrate excellence in music.
          </p>
        </div>
      </div>

      <div className="w-1/2 p-12 bg-white flex flex-col justify-center shadow-lg rounded-l-xl">
        {!forgotPassword ? (
          <>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Login to Your Account</h2>
            <p className="text-sm text-gray-500 mb-6">Enter your credentials to access your account.</p>
            <form onSubmit={handleLogin}>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                <input
                  className="border border-gray-300 rounded-lg w-full py-4 px-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                  type="text"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                <input
                  className="border border-gray-300 rounded-lg w-full py-4 px-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between mb-8">
                <label className="flex items-center text-sm text-gray-700">
                  <input
                    type="checkbox"
                    className="form-checkbox text-red-600 mr-2"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember Me
                </label>
                <button
                  type="button"
                  onClick={() => setForgotPassword(true)}
                  className="text-sm font-semibold text-red-600 hover:text-red-800"
                >
                  Forgot Password?
                </button>
              </div>
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg w-full transition-all transform hover:scale-105 flex justify-center items-center"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                ) : null}
                {loading ? 'Logging in...' : 'LOGIN'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Reset Your Password</h2>
            <p className="text-sm text-gray-500 mb-6">Enter your email to receive a verification code.</p>
            {!otpSent ? (
              <>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                  <input
                    className="border border-gray-300 rounded-lg w-full py-4 px-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    type="text"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button className="bg-red-600 text-white font-bold py-4 px-6 rounded-lg w-full" onClick={handleSendOtp}>
                  SEND VERIFICATION CODE
                </button>
              </>
            ) : resetToken ? (
              <>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2">New Password</label>
                  <input
                    className="border border-gray-300 rounded-lg w-full py-4 px-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    type="password"
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <button className="bg-green-600 text-white font-bold py-4 px-6 rounded-lg w-full" onClick={handleResetPassword}>
                  RESET PASSWORD
                </button>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Verification Code</label>
                  <input
                    className="border border-gray-300 rounded-lg w-full py-4 px-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    type="text"
                    placeholder="Enter verification code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <button className="bg-green-600 text-white font-bold py-4 px-6 rounded-lg w-full" onClick={handleVerifyOtp}>
                  VERIFY CODE
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Login;