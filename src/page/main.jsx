import React from 'react';
import dayjs from 'dayjs';
import { Avatar, Box, Button } from '@mui/material';

import InfoRow from '@arcblock/ux/lib/InfoRow';
import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import Tag from '@arcblock/ux/lib/Tag';
import DID from '@arcblock/ux/lib/DID';
import { UserCenter } from '@blocklet/ui-react/lib/UserCenter';
import uniqBy from 'lodash/uniqBy';

import { useSessionContext } from '../libs/session';

const formatToDatetime = (date) => {
  if (!date) {
    return '-';
  }

  return dayjs(date).format('YYYY-MM-DD hh:mm:ss');
};

export default function Main() {
  const { session, api } = useSessionContext();
  const { t } = useLocaleContext();
  const { preferences } = window.blocklet;
  const { pathname } = window.location;

  const rows = !!session.user
    ? [
        { name: t('name'), value: session.user.fullName },
        preferences.displayAvatar
          ? {
              name: t('avatar'),
              value: <Avatar alt="" src={session.user.avatar}></Avatar>,
            }
          : null,
        {
          name: t('did'),
          value: <DID did={session.user.did} showQrcode locale="zh" />,
        },
        { name: t('email'), value: session.user.email },
        {
          name: t('passports'),
          value: session.user.passports ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {uniqBy(session.user.passports, 'name').map((passport) => (
                <Tag key={passport.name} type={passport.name === 'owner' ? 'success' : 'primary'}>
                  {passport.title}
                </Tag>
              ))}
            </Box>
          ) : (
            '--'
          ),
        },
        {
          name: t('role'),
          value: <Tag type={session.user.role === 'owner' ? 'success' : 'primary'}>{session.user.role}</Tag>,
        },
        {
          name: t('lastLogin'),
          value: formatToDatetime(session.user.updatedAt),
        },
        {
          name: t('createdAt'),
          value: formatToDatetime(session.user.createdAt),
        },
      ].filter(Boolean)
    : [];

  return (
    <>
      <UserCenter
        currentTab={window.blocklet.prefix}
        notLoginContent={
          <Box
            sx={{
              textAlign: 'center',
              fontSize: '18px',
              color: '#888',
              py: 5,
            }}>
            You are not logged in yet! {preferences.welcome}
          </Box>
        }>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            '&>div': {
              mb: 0,
            },
            '.info-row__name': {
              fontWeight: 'bold',
              color: 'grey.800',
            },
          }}>
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
        </Box>

        <Button
          sx={{ mt: 2 }}
          variant="contained"
          color="primary"
          onClick={() => window.trackEvent('user', 'view', session.user?.fullName, 1)}>
          Track Event
        </Button>
      </UserCenter>
    </>
  );
}
