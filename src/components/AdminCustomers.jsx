import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../contexts/AuthContext';

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { token, isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    fetchCustomers();
  }, [token, isLoggedIn]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      const headers = adminToken ? { Authorization: `Bearer ${adminToken}` } : {};
      const response = await api.get('/api/users', { headers });
      const payload = response.data;
      if (Array.isArray(payload)) setCustomers(payload);
      else if (payload && Array.isArray(payload.users)) setCustomers(payload.users);
      else {
        console.warn('Unexpected customers payload:', payload);
        setCustomers([]);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className='main-container'>
        <div className='main-title'>
          <h3>CUSTOMERS MANAGEMENT</h3>
        </div>
        <div className='loading'>Loading customers...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className='main-container'>
        <div className='main-title'>
          <h3>CUSTOMERS MANAGEMENT</h3>
        </div>
        <div className='error'>{error}</div>
      </main>
    );
  }

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>CUSTOMERS MANAGEMENT</h3>
      </div>

      <div className='customers-table'>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone || 'N/A'}</td>
                <td>
                  <span className={`status ${customer.isVerified ? 'verified' : 'unverified'}`}>
                    {customer.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </td>
                <td>
                  <button className='btn-edit'>Edit</button>
                  <button className='btn-delete'>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default AdminCustomers;
