import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@arcblock/ux/lib/Theme";
import { LocaleProvider } from "@arcblock/ux/lib/Locale/context";
import withTracker from '@arcblock/ux/lib/withTracker';

import { SessionProvider } from "./libs/session";
import { translations } from "./locales";
import Main from "./page/main";

let prefix = "/";
if (window.blocklet && window.blocklet.prefix) {
  prefix = window.blocklet.prefix;
}

function App() {
  return (
    <ThemeProvider>
      <LocaleProvider translations={translations}>
        <SessionProvider serviceHost={prefix}>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </SessionProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}

const TrackedApp = withTracker(App);

export default function WrappedApp() {
  // While the blocklet is deploy to a sub path, this will be work properly.
  const basename = window?.blocklet?.prefix || "/";

  return (
    <Router basename={basename}>
      <TrackedApp />
    </Router>
  );
}
