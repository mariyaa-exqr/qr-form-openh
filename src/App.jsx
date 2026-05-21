import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [submissions, setSubmissions] = useState([]);
  const [submitMessage, setSubmitMessage] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const PASSWORD = 'admin123'; // Change this to your password

  // Load submissions from localStorage on mount
  useEffect(() => {
    const savedSubmissions = localStorage.getItem('formSubmissions');
    if (savedSubmissions) {
      setSubmissions(JSON.parse(savedSubmissions));
    }
  }, []);

  // FORM PAGE FUNCTIONS (lines 93-151)
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Create submission object with timestamp
    const newSubmission = {
      id: Date.now(),
      ...formData,
      timestamp: new Date().toLocaleString()
    };

    // Save to state and localStorage
    const updatedSubmissions = [...submissions, newSubmission];
    setSubmissions(updatedSubmissions);
    localStorage.setItem('formSubmissions', JSON.stringify(updatedSubmissions));

    // Show success message
    setSubmitMessage('✓ Form submitted successfully!');
    setFormData({ name: '', email: '', phone: '' });

    // Clear message after 3 seconds
    setTimeout(() => setSubmitMessage(''), 3000);
  };

  // LOGIN PAGE FUNCTIONS (lines 154-186)
  const handleLogin = (e) => {
    e.preventDefault();
    
    if (passwordInput === PASSWORD) {
      setIsLoggedIn(true);
      setCurrentPage('dashboard');
      setPasswordInput('');
      setPasswordError('');
    } else {
      setPasswordError('Wrong password');
      setPasswordInput('');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('form');
    setPasswordInput('');
    setPasswordError('');
  };

  // DASHBOARD PAGE FUNCTIONS (lines 188-276)
  const deleteSubmission = (id) => {
    const updatedSubmissions = submissions.filter(sub => sub.id !== id);
    setSubmissions(updatedSubmissions);
    localStorage.setItem('formSubmissions', JSON.stringify(updatedSubmissions));
  };

  const exportToCSV = () => {
    if (submissions.length === 0) {
      alert('No submissions to export');
      return;
    }

    // Create CSV header
    const headers = ['Name', 'Email', 'Phone', 'Timestamp'];
    const csvContent = [
      headers.join(','),
      ...submissions.map(sub => 
        `"${sub.name}","${sub.email}","${sub.phone}","${sub.timestamp}"`
      )
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Generate QR code data URL (using qr.js library via CDN)
  const generateQRCode = () => {
    // Simple placeholder - in production, use qrcode.react or similar
    return 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23fff%22 width=%22200%22 height=%22200%22/%3E%3Crect fill=%22%23000%22 x=%2220%22 y=%2220%22 width=%2220%22 height=%2220%22/%3E%3C/svg%3E';
  };

  return (
    <div className="app-container">
      {/* FORM PAGE (lines 93-151) */}
      {currentPage === 'form' && (
        <div className="page form-page">
          <h1>Contact Form</h1>
          <form onSubmit={handleFormSubmit} className="form">
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
                placeholder="Enter your name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone:</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                required
                placeholder="Enter your phone"
              />
            </div>

            <button type="submit" className="btn btn-submit">Submit</button>
          </form>

          {submitMessage && <div className="success-message">{submitMessage}</div>}

          <button 
            className="btn btn-login"
            onClick={() => setCurrentPage('login')}
          >
            View Dashboard
          </button>
        </div>
      )}

      {/* LOGIN PAGE (lines 154-186) */}
      {currentPage === 'login' && (
        <div className="page login-page">
          <h1>Admin Login</h1>
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password"
              />
            </div>

            {passwordError && <div className="error-message">{passwordError}</div>}

            <button type="submit" className="btn btn-submit">Login</button>
          </form>

          <button 
            className="btn btn-back"
            onClick={() => setCurrentPage('form')}
          >
            Back to Form
          </button>
        </div>
      )}

      {/* DASHBOARD PAGE (lines 188-276) */}
      {currentPage === 'dashboard' && isLoggedIn && (
        <div className="page dashboard-page">
          <h1>Dashboard</h1>

          <div className="dashboard-header">
            <button 
              className="btn btn-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

          <div className="dashboard-content">
            {/* QR Code Section */}
            <div className="qr-section">
              <h2>Share with Clients</h2>
              <img 
                src={generateQRCode()} 
                alt="QR Code" 
                className="qr-code"
              />
              <p>Scan to access the form</p>
            </div>

            {/* Counter Section */}
            <div className="counter-section">
              <h2>Total Submissions</h2>
              <div className="counter">{submissions.length}</div>
            </div>
          </div>

          {/* Export Button */}
          <div className="export-section">
            <button 
              className="btn btn-export"
              onClick={exportToCSV}
            >
              📥 Export to CSV
            </button>
          </div>

          {/* Submissions Table */}
          <div className="table-section">
            <h2>All Submissions</h2>
            {submissions.length === 0 ? (
              <p className="no-data">No submissions yet</p>
            ) : (
              <div className="table-wrapper">
                <table className="submissions-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Timestamp</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((submission) => (
                      <tr key={submission.id}>
                        <td>{submission.name}</td>
                        <td>{submission.email}</td>
                        <td>{submission.phone}</td>
                        <td>{submission.timestamp}</td>
                        <td>
                          <button 
                            className="btn btn-delete"
                            onClick={() => deleteSubmission(submission.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
