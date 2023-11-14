import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@arcblock/ux/lib/Theme';
import dayjs from 'dayjs';
import jsBridge from 'dsbridge';
import { useWhyDidYouUpdate, useMount, useReactive } from 'ahooks';

import { Avatar, Button, Box, Container } from '@mui/material';

import InfoRow from '@arcblock/ux/lib/InfoRow';
import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import Tag from '@arcblock/ux/lib/Tag';
import DidAddress from '@arcblock/did-connect/lib/Address';
import Header from '@blocklet/ui-react/lib/Header';
import Footer from '@blocklet/ui-react/lib/Footer';
import { AUTH_SERVICE_PREFIX } from '@arcblock/did-connect/lib/constant';

import { useSessionContext } from '../libs/session';

const formatToDatetime = (date) => {
  if (!date) {
    return '-';
  }

  return dayjs(date).format('YYYY-MM-DD hh:mm:ss');
};

export default function Main() {
  const { session, api, connectApi, events } = useSessionContext();
  const [user, setUser] = useState();
  const { t, locale } = useLocaleContext();
  const { preferences } = window.blocklet;
  const popRef = useRef(null);

  const state = useReactive({
    win: null,
  });

  // useEffect(() => {
  //   if (session.initialized) {
  //     if (!session.user) {
  //       session.login();
  //     }
  //   }
  // }, [session.user, session.initialized]);

  // function testLogin() {
  //   session.login(() => {
  //     console.count('login');
  //     location.reload();
  //   });
  // }

  // function testFn() {
  //   const url = 'https://la.ddns.paddings.cn/.well-known/service/functional/federated?mode=test';
  //   popRef.current = window.open(url, 'test', 'popup');
  // }

  // function test() {
  //   api.get('/404');
  // }

  // useEffect(() => {
  //   if (session.initialized && session.user) {
  //     console.log('test', session.user, session.initialized);
  //     // test();
  //   }
  // }, [session.user, session.initialized]);

  // useMount(() => {
  //   // window.addEventListener(
  //   //   'message',
  //   //   (event) => {
  //   //     console.log(event);
  //   //     popRef.current?.postMessage('hi', '*');
  //   //   },
  //   //   false,
  //   // );
  //   events.on('change', (user) => {
  //     console.log('change', user);
  //   });
  //   events.on('switch-profile', (user) => {
  //     console.log('switch-profile', user);
  //   });
  //   events.on('switch-passport', (user) => {
  //     console.log('switch-passport', user);
  //   });
  //   events.on('switch-did', (user) => {
  //     console.log('switch-did', user);
  //   });
  //   events.on('login', (user) => {
  //     console.log('login', user);
  //   });
  //   events.on('logout', (user) => {
  //     console.log('logout', user);
  //   });
  // });

  function testConnect() {
    connectApi.open({
      action: 'login',
      locale,
      messages: {
        title: 'hihi',
        scan: 'scancancancan',
        confirm: 'colors',
        success: 'successasdasdasdasd',
      },
      onSuccess(result) {
        console.log('onSuccess', result);
        // setTimeout(() => {
        //   connectApi.close();
        // }, 1500);
      },
      onClose() {
        console.log('onClose');
        connectApi.close();
      },
      onError() {
        console.log('onError');
      },
    });
  }

  // console.count('render profile demo');

  // useWhyDidYouUpdate('useWhyDidYouUpdateComponent', {
  //   session,
  //   api,
  //   connectApi,
  //   // user,
  //   t,
  //   preferences,
  // });

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

  const autoLoginWallet = () => {
    const target = `${window.location.origin}/api/user`;
    // const target = 'https://bbqaxcsimql5qp2ifuds5rdbozoamxre6hamewd6ewi.did.abtnet.io/api/user';
    console.info('try to login with wallet', {
      target,
      appPid: window.blocklet.appPid,
    });

    jsBridge.call(
      'arcLogin',
      {
        target,
        appPid: window.blocklet.appPid,
      },
      (data) => {
        console.log('login result', data);
      },
    );
  };

  const getVisitorId = () => {
    jsBridge.call('arcGetVisitorId', (data) => {
      console.log('getVisitorId result', data);
    });
  };

  const testFn = () => {
    connectApi.open({
      action: 'profile',
      disableSwitchApp: true,
    });
  };

  const rows = !!user
    ? [
        { name: t('name'), value: user.fullName },
        preferences.displayAvatar ? { name: t('avatar'), value: <Avatar alt="" src={user.avatar}></Avatar> } : null,
        { name: t('did'), value: <DidAddress>{user.did}</DidAddress> },
        { name: t('email'), value: user.email },
        {
          name: t('passports'),
          value: user.passports
            ? user.passports.map((passport, index) => (
                <Tag key={passport.name + index} type={passport.name === 'owner' ? 'success' : 'primary'}>
                  {passport.title}
                </Tag>
              ))
            : '--',
        },
        {
          name: t('role'),
          value: <Tag type={user.role === 'owner' ? 'success' : 'primary'}>{user.role}</Tag>,
        },
        { name: t('lastLogin'), value: formatToDatetime(user.updatedAt) },
        { name: t('createdAt'), value: formatToDatetime(user.createdAt) },
      ].filter(Boolean)
    : [];

  return (
    <Box display="flex" flexDirection="column" height="100vh" overflow="hidden">
      <Header />
      <Box flex="1" my={4} overflow="auto">
        <Container>
          <Button variant="outlined" onClick={autoLoginWallet}>
            手动测试钱包自动登录
          </Button>
          <Button variant="outlined" color="success" onClick={getVisitorId}>
            获取钱包的 visitorId
          </Button>
          <Button variant="outlined" color="error" onClick={testFn}>
            测试
          </Button>
          <MainContainer>
            {/* <button onClick={testFn}>Test fn</button>
            <button onClick={testLogin}>Test Login</button>
            <button onClick={testConnect}>Test Connect</button> */}
            {!user && (
              <div style={{ textAlign: 'center', marginTop: '10vh', fontSize: 18, color: '#777' }}>
                You are not logged in yet! {preferences.welcome}
              </div>
            )}
            {!!user && (
              <div style={{ marginTop: 40 }}>
                {rows.map((row) => {
                  if (row.name === t('did')) {
                    return (
                      <InfoRow
                        valueComponent="div"
                        key={row.name}
                        nameWidth={120}
                        name={row.name}
                        nameFormatter={() => t('did')}>
                        {row.value}
                      </InfoRow>
                    );
                  }

                  return (
                    <InfoRow valueComponent="div" key={row.name} nameWidth={120} name={row.name}>
                      {row.value}
                    </InfoRow>
                  );
                })}
              </div>
            )}
          </MainContainer>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}

const MainContainer = styled('div')`
  max-width: 600px;
  margin: 0 auto;
  .header {
    padding: 20px 0;
    display: flex;
    align-items: center;
  }
`;
