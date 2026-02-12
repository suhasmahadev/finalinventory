import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Warehouses from './pages/Warehouses';
import Analytics from './pages/Analytics';
import Agent from './pages/Agent';
import Billing from './pages/Billing';
import Movement from './pages/Movement';
import Voice from './pages/Voice';
import './index.css';

function App() {
  return (
    <Router>
      <div className="layout">
        <Sidebar />
        <main className="main-content">
          <Header title="InventAI Dashboard" />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/warehouses" element={<Warehouses />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/movement" element={<Movement />} />
            <Route path="/voice" element={<Voice />} />
            <Route path="/agent" element={<Agent />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
