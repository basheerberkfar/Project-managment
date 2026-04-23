import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes, protectedRoutes, notFoundRoute } from './router';
import { Suspense, useEffect } from 'react';
import Loader from '@/components/common/loader';
import { useUIStore } from '@/store/ui.store';
import { ToastProvider } from '@/components/ui/toast';
import '../i18n';

const App = () => {
  const initializeTheme = useUIStore((state) => state.initializeTheme);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return (
    <ToastProvider>
      <Router>
        <Suspense fallback={<Loader />}>
          <Routes>
            {publicRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}

            {protectedRoutes.map(({ path, element, children }) => (
              <Route key={path} path={path} element={element}>
                {children?.map(({ path, element }) => (
                  <Route key={path} path={path} element={element} />
                ))}
              </Route>
            ))}

            <Route path={notFoundRoute.path} element={notFoundRoute.element} />
          </Routes>
        </Suspense>
      </Router>
    </ToastProvider>
  );
};

export default App;
