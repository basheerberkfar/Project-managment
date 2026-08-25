import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import Navbar from './navbar';

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const closeSidebar = () => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />
      {/* No z-index here so fixed sidebar/overlay can stack above navbar (z-30) on mobile */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          onItemClick={closeSidebar}
        />

        {/* Mobile Overlay - above main content (table uses z-30) */}
        {isMobile && !isCollapsed && (
          <div
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={toggleSidebar}
          />
        )}

        <main className="flex-1 flex flex-col h-full overflow-hidden dark:bg-dark-sidebar bg-gray-light-100 text-nature-black dark:text-white">
          <section className="flex-1 flex flex-col w-full h-full px-3 py-6 md:px-4 overflow-y-auto">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
