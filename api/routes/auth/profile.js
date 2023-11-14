/* eslint-disable no-console */
module.exports = {
  action: 'profile',
  claims: {
    profile: () => ({
      description: 'Please provide your full profile',
      fields: ['fullName', 'email', 'phone', 'signature', 'avatar', 'birthday'],
    }),
  },

  onAuth: async ({ userDid, userPk }) => {
    console.info('auth.onAuth', { userPk, userDid });
  },
};