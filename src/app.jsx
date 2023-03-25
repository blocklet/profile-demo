import React from 'react';
import { ThemeProvider } from '@arcblock/ux/lib/Theme';
import { LocaleProvider, useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { SessionProvider } from './libs/session';
import { translations } from './locales';
import Main from './page/main';

let prefix = '/';
if (window.blocklet && window.blocklet.prefix) {
  prefix = window.blocklet.prefix;
}

function App() {
  return (
    <ThemeProvider>
      <LocaleProvider translations={translations}>
        <AppInside />
      </LocaleProvider>
    </ThemeProvider>
  );
}

function AppInside() {
  const { locale } = useLocaleContext();
  return (
    <SessionProvider serviceHost={prefix} locale={locale}>
      <Main />
    </SessionProvider>
  );
}

export default App;
