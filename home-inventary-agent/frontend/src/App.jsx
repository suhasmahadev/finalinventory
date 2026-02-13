import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';

// Agent
import AgentPage from './pages/AgentPage';

// Products
import ProductList from './components/products/ProductList/ProductList';
import ProductForm from './components/products/ProductForm/ProductForm';
import ProductDetail from './components/products/ProductDetail/ProductDetail';
import MLStatus from './components/products/MLStatus/MLStatus';

// Categories
import CategoryList from './components/categories/CategoryList/CategoryList';
import CategoryForm from './components/categories/CategoryForm/CategoryForm';
import CategoryDetail from './components/categories/CategoryDetail/CategoryDetail';

import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-brand">
              Inventory Management System
            </Link>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/agent" className="nav-link">
                  🤖 AI Agent
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/products" className="nav-link">
                  Products
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/categories" className="nav-link">
                  Categories
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/inventory" className="nav-link">
                  Inventory
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/analytics" className="nav-link">
                  Analytics
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/warehouse" className="nav-link">
                  Warehouse
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/billing" className="nav-link">
                  Billing
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/movement" className="nav-link">
                  Movement
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/ml-status" className="nav-link">
                  ML Status
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />

            {/* AI Agent */}
            <Route path="/agent" element={<AgentPage />} />

            {/* Products Routes */}
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/create" element={<ProductForm />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/products/:id/edit" element={<ProductEditPage />} />

            {/* Categories Routes */}
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/categories/create" element={<CategoryForm />} />
            <Route path="/categories/:id" element={<CategoryDetail />} />
            <Route path="/categories/:id/edit" element={<CategoryEditPage />} />

            {/* ML Status */}
            <Route path="/ml-status" element={<MLStatus />} />

            {/* Placeholder routes for other modules */}
            <Route path="/inventory" element={<PlaceholderPage title="Inventory" description="Manage stock levels, add/deduct inventory" />} />
            <Route path="/analytics" element={<PlaceholderPage title="Analytics" description="View sales analytics, forecasts, and reports" />} />
            <Route path="/warehouse" element={<PlaceholderPage title="Warehouse" description="Manage warehouses and storage rooms" />} />
            <Route path="/billing" element={<PlaceholderPage title="Billing" description="Create and manage bills and invoices" />} />
            <Route path="/movement" element={<PlaceholderPage title="Movement" description="Track stock movements and transfers" />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; 2026 Inventory Management System. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

// Home Page Component
const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Inventory Management System</h1>
      <p className="subtitle">Enterprise-grade inventory management with AI-powered assistance</p>

      <div className="feature-grid">
        <div className="feature-card">
          <h3>🤖 AI Agent</h3>
          <p>Chat with the AI agent to manage inventory, get analytics, and perform operations</p>
          <Link to="/agent" className="feature-link">Chat with Agent →</Link>
        </div>

        <div className="feature-card">
          <h3>📦 Products</h3>
          <p>Manage your product catalog with automatic ML sales predictions</p>
          <Link to="/products" className="feature-link">Go to Products →</Link>
        </div>

        <div className="feature-card">
          <h3>🏷️ Categories</h3>
          <p>Organize products into categories for better management</p>
          <Link to="/categories" className="feature-link">Manage Categories →</Link>
        </div>

        <div className="feature-card">
          <h3>📊 Analytics</h3>
          <p>Real-time insights on sales, revenue, and inventory turnover</p>
          <Link to="/analytics" className="feature-link">View Analytics →</Link>
        </div>

        <div className="feature-card">
          <h3>🏭 Warehouse</h3>
          <p>Multi-warehouse and room-level inventory tracking</p>
          <Link to="/warehouse" className="feature-link">Manage Warehouses →</Link>
        </div>

        <div className="feature-card">
          <h3>🧾 Billing</h3>
          <p>Create and manage incoming/outgoing bills with stock integration</p>
          <Link to="/billing" className="feature-link">Go to Billing →</Link>
        </div>

        <div className="feature-card">
          <h3>🔄 Movement</h3>
          <p>Track stock adjustments, transfers, and movement history</p>
          <Link to="/movement" className="feature-link">View Movements →</Link>
        </div>

        <div className="feature-card">
          <h3>🤖 ML Status</h3>
          <p>Check the status of the ML prediction model</p>
          <Link to="/ml-status" className="feature-link">Check Status →</Link>
        </div>
      </div>
    </div>
  );
};

// Product Edit Page Wrapper
const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <ProductForm
      productId={parseInt(id)}
      onSuccess={() => navigate(`/products/${id}`)}
      onCancel={() => navigate(`/products/${id}`)}
    />
  );
};

// Category Edit Page Wrapper
const CategoryEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <CategoryForm
      onSuccess={() => navigate(`/categories/${id}`)}
      onCancel={() => navigate(`/categories/${id}`)}
    />
  );
};

// Placeholder for other modules
const PlaceholderPage = ({ title, description }) => {
  return (
    <div className="placeholder-container">
      <h1>{title}</h1>
      <p>{description}</p>
      <div className="implementation-note">
        <h3>✅ API Integration Ready</h3>
        <p>All API endpoints for this module are already configured in <code>src/services/api.js</code></p>

        <h3>📋 Implementation Pattern:</h3>
        <ol>
          <li>Copy the structure from Products or Categories module</li>
          <li>Update API calls to use the appropriate module API (e.g., <code>warehouseApi</code>)</li>
          <li>Adjust form fields to match the module's schema</li>
          <li>Update table columns to display relevant data</li>
          <li>Add routes in App.jsx</li>
        </ol>

        <h3>🔌 Available API Methods:</h3>
        <p>Check <code>src/services/api.js</code> for all available endpoints for this module.</p>
      </div>
    </div>
  );
};

export default App;
