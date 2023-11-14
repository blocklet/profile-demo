import React from 'react';
import { ThemeProvider } from '@arcblock/ux/lib/Theme';
import { LocaleProvider } from '@arcblock/ux/lib/Locale/context';
import { SessionProvider } from './libs/session';
import { translations } from './locales';
import Main from './page/main';
// import FingerprintJS from '@fingerprintjs/fingerprintjs';

// Initialize the agent at application startup.
// const fpPromise = FingerprintJS.load();

// Get the visitor identifier when you need it.

// async function main() {
//   const fp = await fpPromise;
//   const result = await fp.get();
//   const components = {
//     ...result.components,
//     appPid: { value: 'test-app-pid' },
//     ip: { value: '127.0.0.1' },
//   };

//   const visitorId = FingerprintJS.hashComponents(components);
//   console.log(visitorId, result);
// }

function App() {
  // main();
  return (
    <ThemeProvider>
      <LocaleProvider translations={translations}>
        <SessionProvider protectedRoutes={[]} lazyRefreshToken>
          <Main />
        </SessionProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}

export default App;
