import React from 'react';
import './Dashboard.css';

function Dashboard() {

  const handleLogout = () => {
    window.location.href = '/';
  }
  
  const handleUpdatePassword = () => {
    window.location.href = '/update-password';
  }

  return (
    <div className="dashboard-container">
      <h1>Welcome to Your Dashboard</h1>
      <p>You are successfully logged in! 🥳🥳</p>
      {/* Update password */}
      <button onClick={handleUpdatePassword}>Update Password</button>
      <br />
      

      {/* // logout */}
        <button onClick={handleLogout}>Logout</button>

    </div>

  );
}

export default Dashboard;
