module.exports = {
  action: 'test',
  claims: {
    signature: async () => {
      return {
        description: `Please sign the text`,
        type: 'mime:text/plain',
        data: 'abcdefghijklmnopqrstuvwxyz',
      };
    },
  },

  onAuth: async ({ req, userDid, userPk, claims }) => {
    const type = toTypeInfo(userDid);
    const user = fromPublicKey(userPk, type);
    const claim = claims.find((x) => x.type === 'signature');

    console.info('claim.signature.onAuth', { userPk, userDid, claim });

    if (claim.origin) {
      if (user.verify(claim.origin, claim.sig, claim.method !== 'none') === false) {
        throw new Error('Origin 签名错误');
      }
    }

    // We do not need to hash the data when verifying
    if (claim.digest) {
      if (user.verify(claim.digest, claim.sig, false) === false) {
        throw new Error('Digest 签名错误');
      }
    }

    if (claim.meta && claim.meta.origin) {
      const tx = client.decodeTx(claim.meta.origin);
      const hash = await client.sendTransferV2Tx(
        {
          tx,
          wallet: user,
          signature: claim.sig,
        },
        pickGasPayerHeaders(req),
      );

      console.info('signature.evil.onAuth', { claims, userDid, hash });
      return { hash, tx: claim.meta.origin };
    }
  },
};
