// Update the oracles for usual pools
// scheduled

import hre from 'hardhat';
import assert from 'assert';
import { getTimelock, prepareTimelockData } from '../prepare-timelock';
import { mockExecuteTimelock } from '../mock-exec-timelock';
import { ContractTransaction } from 'ethers';

const job = async () => {
  assert(
    hre.network.name === 'mainnet' ||
      hre.network.name === 'hardhat' ||
      hre.network.name === 'tenderly',
    'not mainnet'
  );
  console.log('using network', hre.network.name);
  const timelock = await getTimelock(hre, '0x00000Ab6Ee5A6c1a7Ac819b01190B020F7c6599d');
  const safe = '0x4e88e72bd81c7ea394cb410296d99987c3a242fe';

  const oracle = await hre.ethers.getContractAt(
    'AaveOracle',
    '0x9a4BF8be3a363bd7fC50833c1C24e8076E2F762E'
  );
  const txs: ContractTransaction[] = [];

  // Update USD0++ oracle
  txs.push({
    to: oracle.target.toString(),
    data: oracle.interface.encodeFunctionData('setAssetSources', [
      ['0x35D8949372D46B7a3D5A56006AE77B215fc69bC0'],
      ['0xd04a2e318e4557bb81344ea485b63d0d55732a37'],
    ]),
  });

  const tx = await prepareTimelockData(hre, safe, txs, timelock.target);
  // const reservesCount = await pool.getReservesCount();
  // console.log('reserves count', reservesCount.toString());
  await mockExecuteTimelock(tx.schedule, tx.execute, 86400 * 5, 'mainnet', async () => {
    // const reservesCountAfter = await pool.getReservesCount();
    // console.log('reserves count after', reservesCountAfter.toString());
  });
};

job();
