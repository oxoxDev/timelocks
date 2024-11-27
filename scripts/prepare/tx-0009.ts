// Do the listing of LBTC on base
import hre from 'hardhat';
import assert from 'assert';
import { getTimelock, prepareTimelockData } from '../prepare-timelock';
import { mockExecuteTimelock } from '../mock-exec-timelock';
import { ContractTransaction } from 'ethers';

const job = async () => {
  assert(
    hre.network.name === 'base' ||
      hre.network.name === 'hardhat' ||
      hre.network.name === 'tenderly',
    'not base'
  );

  console.log('using network', hre.network.name);
  const timelock = await getTimelock(hre, '0x00000Ab6Ee5A6c1a7Ac819b01190B020F7c6599d');
  const pool = await hre.ethers.getContractAt('Pool', '0x766f21277087E18967c1b10bF602d8Fe56d0c671');

  const safe = '0x6F5Ae60d89dbbc4EeD4B08d08A68dD5679Ac61B4';
  const txs: ContractTransaction[] = [];

  const acl = await hre.ethers.getContractAt(
    'ACLManager',
    '0x1cc993f2C8b6FbC43a9bafd2A44398E739733385'
  );

  txs.push(
    await acl.addPoolAdmin.populateTransaction('0x76D34c6794Bdb511eFf788585F10a1007D474Dc6')
  );

  // listing of LBTC on base
  txs.push({
    to: '0x76D34c6794Bdb511eFf788585F10a1007D474Dc6',
    data: '0x107eef450000000000000000000000005213ab3997a596c75ac6ebf81f8aeb9cf9a31007000000000000000000000000000000000000000000000000000000000000018000000000000000000000000007da0e54543a844a80abe69c8a12f22b3aa59f9d000000000000000000000000ecac9c5f704e954931349da37f60e39f515c11c10000000000000000000000000000000000000000000000000000000000001f40000000000000000000000000000000000000000000000000000000000000213400000000000000000000000000000000000000000000000000000000000028a000000000000000000000000000000000000000000000000000000000000003e8000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000bb80000000000000000000000000000000000000000000000000000000000000bb8000000000000000000000000e230cf9cee7b299f69778ef950a61de0de520ba70000000000000000000000005d50be703836c330fc2d147a631cdd7bb8d7171c000000000000000000000000cbdc0aed7cdf2472784068abef23a902cafabb980000000000000000000000000000000000000000000000000000000000000008000000000000000000000000795b70fd08a538598e19a927f5400febfaeb92c7000000000000000000000000ecac9c5f704e954931349da37f60e39f515c11c10000000000000000000000006f5ae60d89dbbc4eed4b08d08a68dd5679ac61b400000000000000000000000073a7a4b40f3fe11e0bcab5538c75d3b984082cae00000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000000220000000000000000000000000000000000000000000000000000000000000026000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000002e000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000360000000000000000000000000000000000000000000000000000000000000001f5a65726f4c656e64204c6f6d62617264205374616b656420426974636f696e0000000000000000000000000000000000000000000000000000000000000000067a304c4254430000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001e5a65726f4c656e64207a6b205661726961626c652044656274204c425443000000000000000000000000000000000000000000000000000000000000000000127661726961626c65446562747a304c4254430000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c5a65726f4c656e64207a6b20537461626c652044656274204c425443000000000000000000000000000000000000000000000000000000000000000000000010737461626c65446562747a304c4254430000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011000000000000000000000000000000000000000000000000000000000000000',
  });

  const tx = await prepareTimelockData(hre, safe, txs, timelock.target);
  const reservesCount = await pool.getReservesCount();

  console.log('reserves count', reservesCount.toString());
  await mockExecuteTimelock(tx.schedule, tx.execute, 86400 * 3, 'base', async () => {
    const reservesCountAfter = await pool.getReservesCount();
    console.log('reserves count after', reservesCountAfter.toString());
  });
};

job();
