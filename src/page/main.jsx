import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Avatar } from '@mui/material';

import { styled } from '@arcblock/ux/lib/Theme';
import InfoRow from '@arcblock/ux/lib/InfoRow';
import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import Tag from '@arcblock/ux/lib/Tag';
import DidAddress from '@arcblock/did-connect/lib/Address';
import { UserCenter } from '@blocklet/ui-react';

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
    <UserCenter currentTab={pathname}>
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
    </UserCenter>
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
