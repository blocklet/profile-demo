import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { LocaleProvider } from '@arcblock/ux/lib/Locale/context';
import { create } from '@arcblock/ux/lib/Theme';

import { SessionProvider } from './libs/session';
import { translations } from './locales';
import Main from './page/main';

let prefix = '/';
if (window.blocklet && window.blocklet.prefix) {
  prefix = window.blocklet.prefix;
}

function App() {
  const theme = create({
    typography: {
      fontSize: 14,
      button: {
        textTransform: 'none',
      },
    },
    overrides: {
      MuiTableRow: {
        root: {
          '&:nth-child(even)': {
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
          },
        },
        head: {
          backgroundColor: 'transparent',
        },
      },
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <StyledThemeProvider theme={theme}>
        <LocaleProvider translations={translations}>
          <SessionProvider serviceHost={prefix}>
            <CssBaseline />
            <Main />
          </SessionProvider>
        </LocaleProvider>
      </StyledThemeProvider>
    </MuiThemeProvider>
  );
}

export default App;
