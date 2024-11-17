export const timelockConfig = {
  coldWallet: '0x84E0E243bF4D297C63740E284e2977836AC011CD', // cold wallet (custodian) which has the ability to propose transactions as well as cancel them in case safe gets compromised
  hotWallet: '0x6aac0942B8147BffAB73789a82EE12fDA7735BAc', // hot wallet (deployer) which has the ability to execute transactions

  // TODO once the governance is live, we will restrict the cold wallet to only cancel transactions

  governorContracts: {
    // todo we need to deploy the various governor contracts
  },

  // The following addresses are the various gnosis safes. they have the ability to execute transactions
  gnosisSafes: {
    linea: '0x14aAD4668de2115e30A5FeeE42CFa436899CCD8A',
    manta: '0x4dcF6a8a1Ea1BFca91deA33a92604F6723f570dD',
    base: '0x6F5Ae60d89dbbc4EeD4B08d08A68dD5679Ac61B4',
    zircuit: '0x4208d11fEE26d32CF53a538080d0C1D8F1481b3A',
    zksync: '0x1890F9204882dfa1B8f0AEaF56ae9b2ed149D18d',
    xlayer: '0xd53812368A92c509092F2CB7972AceBa109155ab',
    blast: '0xa01AfbE9D874241F3697CB83FAe59977F0Aa2741',
    mainnet: '0x4E88E72bd81C7EA394cB410296d99987c3A242fE',
  },
};
