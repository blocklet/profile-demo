import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';

import Avatar from '@material-ui/core/Avatar';
import Header from '@arcblock/ux/lib/Layout/header';
import Footer from '@arcblock/ux/lib/Layout/footer';
import { getWebWalletUrl } from '@arcblock/did-connect/lib/utils';
import SessionManager from '@arcblock/did-connect/lib/SessionManager';

import InfoRow from '@arcblock/ux/lib/InfoRow';
import Button from '@arcblock/ux/lib/Button';
import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import Tag from '@arcblock/ux/lib/Tag';
import DidAddress from '@arcblock/did-connect/lib/Address';

import { useSessionContext } from '../libs/session';

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
  const webWalletUrl = getWebWalletUrl();

  useEffect(() => {
    getData();
  }, [session.user]); //eslint-disable-line

  const getData = () => {
    api
      .get('/api/user')
      .then((res) => {
        console.log(res.data.user);
        setUser(res.data.user);
      })
      .catch(() => {});
  };

  const isLogin = !!session.user;

  const rows = !!user
    ? [
        { name: t('name'), value: user.fullName },
        { name: t('avatar'), value: <Avatar alt="" src={user.avatar}></Avatar> },
        { name: t('did'), value: <DidAddress>{user.did}</DidAddress> },
        { name: t('email'), value: user.email },
        {
          name: t('passports'),
          value: user.passports ?
            user.passports.map(passport => <Tag type={passport.name === 'owner' ? 'success' : 'default'}>{passport.title}</Tag>)
            : '--',
        },
        {
          name: t('role'),
          value: <Tag type={user.role === 'owner' ? 'success' : 'default'}>{user.role}</Tag>,
        },
        { name: t('lastLogin'), value: formatToDatetime(user.updatedAt) },
        { name: t('createdAt'), value: formatToDatetime(user.createdAt) },
      ].filter(Boolean)
    : [];

  return (
    <Container>
      <Header {...{
        appLogo: <img src={window.blocklet.appLogo} style={{borderRadius: 8, width: 40, height: 40}}/>,
        navigation: window.blocklet.navigation || [],
        theme: window.blocklet.theme || {},
        addons: [
          <SessionManager session={session} webWalletUrl={webWalletUrl} showRole />
        ],
        style: {
          marginBottom: 16,
        },
      }}></Header>

      <Media className="header">
        <div className="left">
          <div style={{ fontSize: 20 }}>Profile Demo</div>
        </div>
        <div className="right">
          {isLogin && (
            <span style={{ top: 1, position: 'relative', marginRight: 6 }}>Hello, {session.user.fullName}</span>
          )}
          <Button onClick={() => (isLogin ? session.logout() : session.login())}>{isLogin ? 'Logout' : 'Login'}</Button>
        </div>
      </Media>

      {!user && (
        <div style={{ textAlign: 'center', marginTop: '10vh', fontSize: 18, color: '#888' }}>
          You are not logged in yet
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

      <Footer {...{
        navigation: window.blocklet.navigation || [],
        theme: window.blocklet.theme || {},
        style: {
          marginTop: 16
        }
      }}></Footer>
    </Container>
  );
}

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 0 10px;
  .header {
    padding: 20px 0;
    display: flex;
    align-items: center;
  }
`;

const Media = styled.div`
  display: flex;
  justify-content: space-between;
  .left {
    flex-shrink: 0;
    margin-right: 10px;
  }
  .body {
    flex-grow: 1;
  }
  .right {
    flex-shrink: 0;
    margin-left: 10px;
  }
`;
