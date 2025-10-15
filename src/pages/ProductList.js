import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTh, FaList, FaTag, FaMapMarkerAlt, FaSearch, FaShoppingCart, FaBolt, FaFilter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';
import { useCart } from '../contexts/CartContext';
import './ProductList.css';

const ProductList = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hideOutOfStock, setHideOutOfStock] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const { addToCart: addToCartContext } = useCart();

  // Fetch categories
  useEffect(() => {
    axios.get('/api/categories').then(res => setCategories(res.data));
  }, []);

  // Fetch products
  const fetchProducts = (page = currentPage) => {
    setLoading(true);
    let url = "/api/products";
    const params = [];
    if (selectedCategory !== "all") params.push(`category=${encodeURIComponent(selectedCategory)}`);
    if (search.trim()) params.push(`search=${encodeURIComponent(search.trim())}`);
    if (minPrice) params.push(`min=${minPrice}`);
    if (maxPrice) params.push(`max=${maxPrice}`);
    params.push(`page=${page}`);
    params.push(`limit=12`);
    params.push(`sortBy=${sortBy}`);
    params.push(`sortOrder=${sortOrder}`);
    if (params.length) url += `?${params.join('&')}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setPagination(data.pagination || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Fetch on category or search change
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [selectedCategory]);

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

const addToCart = async (productId, quantity) => {
    try {
        await addToCartContext(productId, quantity);
        showSuccess('Added to cart!');
    } catch (error) {
        showError('Failed to add to cart.');
    }
};

  const handleBuyNow = (product) => {
    navigate('/checkout', { state: { product } });
  };

  // Navigate to product details
  const handleProductClick = (id) => {
    navigate(`/products/${id}`);
  };

  return (
    <div className="product-list-container">
      <div style={{ display: 'flex', width: '100%' }}>
        {/* Sidebar */}
        <aside className="product-sidebar">
          <h3 className="sidebar-title">
            <FaFilter style={{ marginRight: '0.5rem' }} />
            Categories
          </h3>
          <ul className="category-list">
            <li
              className={`category-item ${selectedCategory === "all" ? "active" : ""}`}
              onClick={() => setSelectedCategory("all")}
            >
              ALL PRODUCTS
            </li>
            {categories.map(cat => (
              <li
                key={cat._id}
                className={`category-item ${selectedCategory === cat.name ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                {cat.name}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="product-main-content">
          {/* Header Row */}
          <div className="product-header">
            <h2 className="product-title">
              {selectedCategory === "all" ? "All Products" : selectedCategory}
            </h2>
            <div className="view-toggle">
              <button
                className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <FaTh /> Grid
              </button>
              <button
                className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <FaList /> List
              </button>
            </div>
            <form className="search-form" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                className="search-input"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button type="submit" className="search-button">
                <FaSearch />
              </button>
            </form>
          </div>

          {/* Filters and Sorting Row */}
          <div className="filters-row">
            <div className="filter-group">
              <label className="filter-label">Sort by:</label>
              <select
                className="filter-select"
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); fetchProducts(); }}
              >
                <option value="createdAt">Newest</option>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
                <option value="name">Name</option>
              </select>
              <select
                className="filter-select"
                value={sortOrder}
                onChange={(e) => { setSortOrder(e.target.value); fetchProducts(); }}
              >
                <option value="desc">High to Low</option>
                <option value="asc">Low to High</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Price:</label>
              <input
                type="number"
                className="price-input"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span style={{ color: '#718096', fontWeight: '600' }}>-</span>
              <input
                type="number"
                className="price-input"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
              <button
                className="apply-button"
                onClick={() => fetchProducts()}
              >
                Apply
              </button>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="hideOutOfStock"
                className="checkbox-input"
                checked={hideOutOfStock}
                onChange={(e) => setHideOutOfStock(e.target.checked)}
              />
              <label htmlFor="hideOutOfStock" className="filter-label">Hide out of stock</label>
            </div>
          </div>

          {loading && <div className="loading-text">Loading products...</div>}

          {/* Product Grid */}
          <div className={`product-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
            {products.filter(product => !hideOutOfStock || (product.stock > 0)).map(product => (
              <div
                key={product._id}
                className={`product-card ${viewMode === 'list' ? 'list-view' : ''}`}
                onClick={() => handleProductClick(product._id)}
              >
                <div className="product-image-container">
                  <img
                    src={`http://localhost:5000${product.image}`}
                    alt={product.name}
                    className="product-image"
                  />
                  {product.discount > 0 && (
                    <div className="discount-badge">
                      <FaTag /> -{product.discount}%
                    </div>
                  )}
                </div>
                <div className="product-info">
                  <h4 className="product-name">{product.name}</h4>
                  {product.brand && <p className="product-brand">{product.brand}</p>}
                  <div className="product-rating">
                    <div className="rating-stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`rating-star ${i < (product.rating || 0) ? 'filled' : ''}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="rating-text">
                      {product.rating ? product.rating : 0}/5
                    </span>
                  </div>
                  <div className="product-price-row">
                    <span className="product-price">₹{product.price}</span>
                  </div>
                  {product.stockLocation && (
                    <div className="product-location">
                      <FaMapMarkerAlt /> {product.stockLocation}
                    </div>
                  )}
                  <div className="product-actions">
                    <button
                      className="action-button primary"
                      onClick={e => { e.stopPropagation(); addToCart(product._id, 1); }}
                    >
                      <FaShoppingCart style={{ marginRight: '0.5rem' }} />
                      Add to Cart
                    </button>
                    <button
                      className="action-button secondary"
                      onClick={e => { e.stopPropagation(); handleBuyNow(product); }}
                    >
                      <FaBolt style={{ marginRight: '0.5rem' }} />
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-button"
                onClick={() => { setCurrentPage(pagination.currentPage - 1); fetchProducts(pagination.currentPage - 1); }}
                disabled={!pagination.hasPrevPage}
              >
                Previous
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`page-button ${page === pagination.currentPage ? 'active' : ''}`}
                  onClick={() => { setCurrentPage(page); fetchProducts(page); }}
                >
                  {page}
                </button>
              ))}

              <button
                className="page-button"
                onClick={() => { setCurrentPage(pagination.currentPage + 1); fetchProducts(pagination.currentPage + 1); }}
                disabled={!pagination.hasNextPage}
              >
                Next
              </button>
            </div>
          )}

          {/* Results info */}
          {pagination.totalProducts > 0 && (
            <div className="results-info">
              Showing {((pagination.currentPage - 1) * 12) + 1}-{Math.min(pagination.currentPage * 12, pagination.totalProducts)} of {pagination.totalProducts} products
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductList;
