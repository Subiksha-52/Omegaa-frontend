import React, { useState, useEffect } from 'react';
import api from '../api';

function AdminInventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      const headers = adminToken ? { Authorization: `Bearer ${adminToken}` } : {};
      const response = await api.get('/api/products', { headers });

      const productsPayload = response.data;
      const products = Array.isArray(productsPayload) ? productsPayload : productsPayload.products || [];

      // Calculate inventory stats
      const inventoryData = products.map(product => ({
        id: product._id,
        name: product.name,
        category: product.category,
        currentStock: product.qty,
        lowStock: product.qty < 10,
        lastUpdated: product.updatedAt || product.createdAt
      }));

      setInventory(inventoryData);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className='main-container'>
        <div className='main-title'>
          <h3>INVENTORY MANAGEMENT</h3>
        </div>
        <div className='loading'>Loading inventory...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className='main-container'>
        <div className='main-title'>
          <h3>INVENTORY MANAGEMENT</h3>
        </div>
        <div className='error'>{error}</div>
      </main>
    );
  }

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>INVENTORY MANAGEMENT</h3>
      </div>

      <div className='inventory-table'>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} className={item.lowStock ? 'low-stock' : ''}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.currentStock}</td>
                <td>
                  <span className={`status ${item.lowStock ? 'warning' : 'good'}`}>
                    {item.lowStock ? 'Low Stock' : 'In Stock'}
                  </span>
                </td>
                <td>{new Date(item.lastUpdated).toLocaleDateString()}</td>
                <td>
                  <button className='btn-restock'>Restock</button>
                  <button className='btn-edit'>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default AdminInventory;
