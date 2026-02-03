import { lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from '@arcblock/ux/lib/Config';
import withTracker from '@arcblock/ux/lib/withTracker';

import { SessionProvider } from './libs/session';
import { translations } from './locales';
const Main = lazy(() => import('./page/main'));

function App() {
  return (
    <ConfigProvider translations={translations}>
      <SessionProvider>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="*" element={<Main />} />
          {/* <Route path="*" element={<Navigate to="/" />} /> */}
        </Routes>
      </SessionProvider>
    </ConfigProvider>
  );
}

const TrackedApp = withTracker(App);

export default function WrappedApp() {
  // While the blocklet is deploy to a sub path, this will be work properly.
  const basename = window?.blocklet?.prefix || '/';

  return (
    <Router basename={basename}>
      <TrackedApp />
    </Router>
  );
}
