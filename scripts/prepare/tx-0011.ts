// add pool admin roles to timelock and listing contract
// executed https://era.zksync.network/tx/0x04395af1b7173c81631e1b2c31328990bea34afb00a2cea0f877dc8a833dc969

import hre from 'hardhat';
import assert from 'assert';
import { getTimelock, prepareTimelockData } from '../prepare-timelock';
import { mockExecuteTimelock } from '../mock-exec-timelock';
import { ContractTransaction } from 'ethers';

const job = async () => {
  assert(
    hre.network.name === 'zksync' ||
      hre.network.name === 'hardhat' ||
      hre.network.name === 'tenderly',
    'not mainnet'
  );
  console.log('using network', hre.network.name);
  const timelock = await getTimelock(hre, '0x861cC6724D0aA7Ec7a868887643e682b1c16aeeC');
  const safe = '0x1890F9204882dfa1B8f0AEaF56ae9b2ed149D18d';
  const txs: ContractTransaction[] = [];

  const acl = await hre.ethers.getContractAt(
    'ACLManager',
    '0x9A60cce3da06d246b492931d2943A8F574e67389'
  );

  // add pool to listing contract
  txs.push(
    await acl.addPoolAdmin.populateTransaction('0x35cD64fD9b22D864bD166e0fFc1474F6090209AB')
  );
  // add pool to timelock
  txs.push(await acl.addPoolAdmin.populateTransaction(timelock.target));

  const tx = await prepareTimelockData(hre, safe, txs, timelock.target);
  await mockExecuteTimelock(tx.schedule, tx.execute, 86400 * 5, 'zksync', async () => {});
};

job();
