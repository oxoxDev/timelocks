// fix oracle for USDe and update the market to disable a wallet

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
  const pool = await hre.ethers.getContractAt('Pool', '0xD3a4DA66EC15a001466F324FA08037f3272BDbE8');
  const acl = await hre.ethers.getContractAt(
    'ACLManager',
    '0x6C9E32e37F3377D1824304f80bD135be85f5C8c8'
  );
  const aaveOracle = await hre.ethers.getContractAt(
    'AaveOracle',
    '0x9a4BF8be3a363bd7fC50833c1C24e8076E2F762E'
  );

  const txs: ContractTransaction[] = [];

  // sUSDe Mar PT oracle update
  txs.push(
    await aaveOracle.setAssetSources.populateTransaction(
      ['0xe00bd3df25fb187d6abbb620b3dfd19839947b81'],
      ['0xa569d910839Ae8865Da8F8e70FfFb0cBA869F961']
    )
  );

  // make pool admin
  txs.push(
    await acl.addPoolAdmin.populateTransaction('0x4E88E72bd81C7EA394cB410296d99987c3A242fE')
  );

  // update aToken impl to recall wallet balance

  const tx = await prepareTimelockData(hre, safe, txs, timelock.target);
  const reservesCount = await pool.getReservesCount();

  console.log('reserves count', reservesCount.toString());
  await mockExecuteTimelock(tx.schedule, tx.execute, 86400 * 5, 'mainnet', async () => {
    const reservesCountAfter = await pool.getReservesCount();
    console.log('reserves count after', reservesCountAfter.toString());
  });
};

job();
