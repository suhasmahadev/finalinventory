import { useState, useEffect } from 'react';
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <Router>
      <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] transition-colors duration-500 relative overflow-hidden"> 
        
        {/* BACKGROUND */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-[120px]"></div>
            <div className="absolute bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[120px]"></div>
        </div>

        {/* SIDEBAR */}
        <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
        
        {/* MAIN CONTENT AREA */}
        <main 
            className={`flex-1 flex flex-col transition-all duration-300 ease-in-out z-10 relative min-h-screen ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}
        > 
          {/* HEADER: Needs to be fixed at the top */}
          <Header title="InventAI Dashboard" toggleTheme={toggleTheme} isDarkMode={isDarkMode} isCollapsed={isSidebarCollapsed} />
          
          {/* PAGE CONTENT CONTAINER */}
          {/* ADDED 'pt-24': This pushes ALL page content down so it never hides behind the header */}
          <div className="p-8 pt-24 text-slate-800 dark:text-slate-100 flex-1 overflow-y-auto"> 
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/warehouses" element={<Warehouses />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/agent" element={<Agent />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/movement" element={<Movement />} />
              <Route path="/voice" element={<Voice />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;