import React, { useState } from 'react';
import '../styles/Login.css';
import api from '../services/api';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.get('/users');
      const users = response.data;

      // ✅ Add hardcoded superadmin user
      users.push({
        email: 'snraju007007@gmail.com',
        password: 'Pineameterworld',
        role: 'superadmin',
        expiring_date: '2099-12-31'
      });

      const user = users.find((u) => u.email === email);

      if (!user) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      // Check password
      if (user.password !== password) {
        setError('Invalid password');
        setIsLoading(false);
        return;
      }

      // Check role
      if (!['subadmin', 'superadmin'].includes(user.role)) {
        setError('Access restricted. Only admins can login.');
        setIsLoading(false);
        return;
      }

      // Check expiry date
      const currentDate = new Date();
      const expiryDate = new Date(user.expiring_date);

      if (currentDate > expiryDate) {
        setError('Account suspended. Please contact support.');
        setIsLoading(false);
        return;
      }

      // Store user data in localStorage
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userData', JSON.stringify(user));

      // Successful login
      setError('');
      onLoginSuccess && onLoginSuccess(user);

    } catch (err) {
      console.error('Login error:', err);
      setError('Error connecting to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}

        <div className="input-container">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-container password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className={`toggle-password ${showPassword ? 'visible' : ''}`}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <span className="eye-icon">
              <svg viewBox="0 0 24 24">
                {showPassword ? (
                  <>
                    <path d="M12 9a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0 9.821 9.821 0 0 0-17.64 0z" />
                  </>
                ) : (
                  <>
                    <path d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3h-.17m-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22 21 20.73 3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7z" />
                  </>
                )}
              </svg>
            </span>
          </button>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
