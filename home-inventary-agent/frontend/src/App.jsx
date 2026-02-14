import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Cpu,
  Package,
  Tags,
  BarChart3,
  Warehouse,
  Receipt,
  ArrowLeftRight,
  Activity,
  ArrowRight
} from 'lucide-react';

// Layout Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';

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

// Dashboards
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import WarehouseDashboard from './components/warehouse/WarehouseDashboard';
import BillingDashboard from './components/billing/BillingDashboard';
import MovementDashboard from './components/movement/MovementDashboard';
import InventoryDashboard from './components/inventory/InventoryDashboard';

import LandingPage from './components/landing/LandingPage';

import ScrollToTop from './components/ScrollToTop';

// Enterprise Pages
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import ApiDocsPage from './pages/ApiDocsPage';
import ArchitecturePage from './pages/ArchitecturePage';

const AppContent = () => {
  // Remove theme state and effects - enforcing single theme

  const location = useLocation();

  return (
    <div className="min-h-screen font-sans selection:bg-brown-500/30 bg-beige-50 text-brown-900">
      <Routes location={location} key={location.pathname}>
        {/* Landing Page Route - Default Root */}
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard Routes - Protected Layout */}
        <Route path="/*" element={
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-64 transition-all duration-300 page-enter">
              <Header />
              <main className="p-6 min-h-screen">
                <Routes location={location}>
                  {/* Dashboard Home */}
                  <Route path="/dashboard" element={<Home />} />

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

                  {/* Dashboards */}
                  <Route path="/inventory" element={<InventoryDashboard />} />
                  <Route path="/analytics" element={<AnalyticsDashboard />} />
                  <Route path="/warehouse" element={<WarehouseDashboard />} />
                  <Route path="/billing" element={<BillingDashboard />} />
                  <Route path="/movement" element={<MovementDashboard />} />

                  {/* Enterprise Pages */}
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/api" element={<ApiDocsPage />} />
                  <Route path="/architecture" element={<ArchitecturePage />} />
                </Routes>
              </main>
            </div>
          </div>
        } />
      </Routes>
    </div>
  );
};

// Home Page Component
const Home = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-brown-900 mb-2">Command Center</h1>
        <p className="text-brown-500">System operational. AI Agent active and monitoring inventory.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="AI Agent"
          description="Chat with the inventory assistant"
          link="/agent"
          icon={Cpu}
          color="emerald"
          badge="Online"
        />
        <DashboardCard
          title="Products"
          description="Manage catalog & predictions"
          link="/products"
          icon={Package}
          color="blue"
        />
        <DashboardCard
          title="Analytics"
          description="Revenue & sales insights"
          link="/analytics"
          icon={BarChart3}
          color="purple"
        />
        <DashboardCard
          title="ML Status"
          description="Model training health"
          link="/ml-status"
          icon={Activity}
          color="amber"
          badge="Training"
        />
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-brown-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard title="Add New Product" link="/products/create" icon={Package} />
          <ActionCard title="New Category" link="/categories/create" icon={Tags} />
          <ActionCard title="Warehouse Audit" link="/warehouse" icon={Warehouse} />
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, description, link, icon: Icon, color = "brown", badge }) => {
  // Map legacy color props to new theme colors
  const colorMap = {
    emerald: "brown",
    blue: "brown",
    purple: "brown",
    amber: "brown"
  };

  const activeColor = colorMap[color] || color;

  return (
    <Link to={link} className="block h-full glass-panel rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon className="w-24 h-24 transform rotate-12 text-brown-900" />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 rounded-lg bg-beige-100 border border-beige-200 text-brown-600 group-hover:text-brown-800 transition-colors">
            <Icon className="w-6 h-6" />
          </div>
          {badge && (
            <span className="px-2 py-1 text-xs font-bold rounded bg-brown-100 border border-brown-200 text-brown-700">
              {badge}
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-brown-900 mb-1 group-hover:text-brown-700 transition-colors">{title}</h3>
        <p className="text-sm text-brown-500 mb-4">{description}</p>

        <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-brown-400 group-hover:text-brown-600 transition-colors">
          Access Module <ArrowRight className="w-3 h-3 ml-1" />
        </div>
      </div>
    </Link>
  );
};

const ActionCard = ({ title, link, icon: Icon }) => (
  <Link to={link} className="flex items-center gap-4 p-4 glass-panel border border-beige-200 rounded-lg hover:bg-beige-50 transition-all group">
    <div className="p-2 rounded-md bg-beige-100 text-brown-500 group-hover:text-brown-700 transition-colors">
      <Icon className="w-5 h-5" />
    </div>
    <span className="font-medium text-brown-700 group-hover:text-brown-900">{title}</span>
    <ArrowRight className="w-4 h-4 ml-auto text-brown-400 group-hover:text-brown-600 opacity-0 group-hover:opacity-100 transition-all" />
  </Link>
);

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
const PlaceholderPage = ({ title, description, icon: Icon }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        {Icon && <div className="p-3 bg-white border border-beige-200 rounded-xl text-brown-600 shadow-sm"><Icon className="w-8 h-8" /></div>}
        <div>
          <h1 className="text-3xl font-bold text-brown-900">{title}</h1>
          <p className="text-brown-500 mt-1">{description}</p>
        </div>
      </div>

      <div className="glass-panel border border-beige-200 rounded-xl p-8 border-l-4 border-l-brown-500 shadow-lg">
        <h3 className="text-xl font-bold text-brown-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-brown-600" /> API Integration Ready
        </h3>
        <p className="text-brown-700 mb-6">
          All API endpoints for this module are configured in <code className="bg-beige-100 px-2 py-1 rounded text-brown-800 font-mono text-sm border border-beige-200">src/services/api.js</code>
        </p>

        <h3 className="text-lg font-semibold text-brown-900 mb-3">Implementation Guide:</h3>
        <ol className="list-decimal list-inside space-y-2 text-brown-600 ml-4">
          <li>Copy structure from <span className="text-brown-800 font-medium">Products</span> or <span className="text-brown-800 font-medium">Categories</span> module</li>
          <li>Update API calls to use the appropriate module API</li>
          <li>Adjust form fields to match the module's schema</li>
          <li>Update table columns to display relevant data</li>
        </ol>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}





export default App;
