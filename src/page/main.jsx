import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Header, UserCenter } from '@blocklet/ui-react';

import { useSessionContext } from '../libs/session';

export default function Main() {
  const { session, api, connectApi } = useSessionContext();
  const [user, setUser] = useState();
  const { preferences } = window.blocklet;
  const { pathname } = window.location;

  useEffect(() => {
    getData();
  }, [session.user]); //eslint-disable-line

  const getData = () => {
    api
      .get('/api/user')
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        window.location.reload();
      });
  };

  const params = {
    switchBehavior: 'auto',
    forceConnected: 'z1fUwUgKjtPEJs6ABLePEdzjdDEvZvwWp4h',
    // forceConnected: 'z1cT33B6mTr95QKXK2wvDum9n1H78gmLFij',
    sourceAppPid: 'zNKYcyBgNoHQ3GHjUQJUkJH8op4CLXyQH4ee',
    // forceConnected: 'z1giMkK9vzvA5JMS2HASvL8g2tGzJNsZPSY',
    // sourceAppPid: 'zNKmmPJhp43ufAYLV39pffRzK2jnVABG2ZSX',
  };

  const urlInstance = new URL(location.href);
  urlInstance.searchParams.set('__did-connect__', Buffer.from(JSON.stringify(params), 'utf8').toString('base64'));
  const urlAuto = urlInstance.href;

  urlInstance.searchParams.set(
    '__did-connect__',
    Buffer.from(JSON.stringify({ ...params, switchBehavior: 'required' }), 'utf8').toString('base64'),
  );
  const urlRequired = urlInstance.href;
  urlInstance.searchParams.set(
    '__did-connect__',
    Buffer.from(JSON.stringify({ ...params, switchBehavior: 'disabled' }), 'utf8').toString('base64'),
  );
  const urlDisabled = urlInstance.href;

  return user ? (
    <UserCenter
      currentTab={pathname}
      // userDid="z1fE6GTBW7ewzFr6CKPx88pVKQEndyDhHzX"
    >
      Hello, {user.fullName}
      <ul>
        <li>
          <a href={urlAuto}>auto</a>
        </li>
        <li>
          <a href={urlRequired}>required</a>
        </li>
        <li>
          <a href={urlDisabled}>disabled</a>
        </li>
      </ul>
    </UserCenter>
  ) : (
    <>
      <Header />
      <Box
        sx={{
          textAlign: 'center',
          fontSize: '18px',
          color: '#888',
          py: 5,
        }}>
        You are not logged in yet! {preferences.welcome}
      </Box>
    </>
  );
}
