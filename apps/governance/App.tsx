import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { NetworkProvider } from './context/NetworkContext';
import { ToastProvider } from './context/ToastContext';

// Layout
import { Sidebar } from './shared/layout/Sidebar';
import { Header } from './shared/layout/Header';

// Features
import Dashboard from './features/dashboard/Dashboard';
import Governance from './features/governance/Governance';
import Underwriting from './features/underwriting/Underwriting';
import Judiciary from './features/judiciary/Judiciary';

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ToastProvider>
      <NetworkProvider>
        <Router>
          <div className="min-h-screen bg-zinc-950 flex text-zinc-100">
            
            <Sidebar 
              mobileOpen={mobileOpen} 
              setMobileOpen={setMobileOpen} 
              collapsed={collapsed} 
              setCollapsed={setCollapsed}
            />
            
            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-200 ${
              collapsed ? 'lg:pl-16' : 'lg:pl-56'
            }`}>
              <Header onMenuClick={() => setMobileOpen(true)} />
              
              <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
                <div className="max-w-6xl mx-auto">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/governance" element={<Governance />} />
                    <Route path="/underwriting" element={<Underwriting />} />
                    <Route path="/judiciary" element={<Judiciary />} />
                  </Routes>
                </div>
              </main>
            </div>
            
          </div>
        </Router>
      </NetworkProvider>
    </ToastProvider>
  );
}