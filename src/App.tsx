import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { Invoices } from './pages/Invoices';
import { Settings } from './pages/Settings';

const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/':
        return 'Dashboard';
      case '/inventory':
        return 'Inventory Management';
      case '/invoices':
        return 'Invoice Management';
      case '/settings':
        return 'Settings';
      default:
        return 'Time2Invent';
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className="flex-1 lg:ml-64">
          <Routes>
            {[
              { path: '/', component: Dashboard },
              { path: '/inventory', component: Inventory },
              { path: '/invoices', component: Invoices },
              { path: '/settings', component: Settings },
            ].map(({ path, component: Component }) => (
              <Route
                key={path}
                path={path}
                element={
                  <div className="min-h-screen">
                    <Header
                      toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                      title={getPageTitle(path)}
                    />
                    <main className="p-6">
                      <Component />
                    </main>
                  </div>
                }
              />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
};

export default App;