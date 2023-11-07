import React, { useState, useEffect } from 'react';
import { styled } from '@arcblock/ux/lib/Theme';
import dayjs from 'dayjs';
import jsBridge from 'dsbridge';

import { Avatar, Button, Box, Container } from '@mui/material';

import InfoRow from '@arcblock/ux/lib/InfoRow';
import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import Tag from '@arcblock/ux/lib/Tag';
import DidAddress from '@arcblock/did-connect/lib/Address';
import Header from '@blocklet/ui-react/lib/Header';
import Footer from '@blocklet/ui-react/lib/Footer';

import { useSessionContext } from '../libs/session';
import { AUTH_SERVICE_PREFIX } from '@arcblock/did-connect/lib/constant';

const formatToDatetime = (date) => {
  if (!date) {
    return '-';
  }

  return dayjs(date).format('YYYY-MM-DD hh:mm:ss');
};

export default function Main() {
  const { session, api } = useSessionContext();
  const [user, setUser] = useState();
  const { t } = useLocaleContext();
  const { preferences } = window.blocklet;

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
    const target = `${window.location.origin}${AUTH_SERVICE_PREFIX}/api/user/loginByWallet`;
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
    jsBridge.call('arcGetVistorId', (data) => {
      console.log('getVistorId result', data);
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
            ? user.passports.map((passport) => (
                <Tag key={passport.name} type={passport.name === 'owner' ? 'success' : 'primary'}>
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
          <MainContainer>
            {!user && (
              <div style={{ textAlign: 'center', marginTop: '10vh', fontSize: 18, color: '#888' }}>
                You are not logged in yet! {preferences.welcome}
              </div>
            )}

            {!!user && (
              <div style={{ marginTop: 40 }}>
                {rows.map((row) => {
                  if (row.name === t('common.did')) {
                    return (
                      <InfoRow
                        valueComponent="div"
                        key={row.name}
                        nameWidth={120}
                        name={row.name}
                        nameFormatter={() => t('common.did')}>
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
