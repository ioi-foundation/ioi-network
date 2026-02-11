import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ExplorerLayout } from './layout/ExplorerLayout';
import { Dashboard } from './features/Dashboard';

// Placeholder for missing pages
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-64 border border-dashed border-zinc-800 rounded-lg">
    <h3 className="text-xl font-bold text-zinc-500">{title}</h3>
    <p className="text-zinc-600">Coming soon in v2.4.1</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <ExplorerLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/blocks" element={<Placeholder title="Blocks List" />} />
          <Route path="/txs" element={<Placeholder title="Transactions List" />} />
          <Route path="/address/:addr" element={<Placeholder title="Address Details" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ExplorerLayout>
    </BrowserRouter>
  );
}

export default App;
