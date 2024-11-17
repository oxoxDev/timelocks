// Delisting superOETH and pumpBTC from the base market
import hre from 'hardhat';
import assert from 'assert';
import { getTimelock, prepareTimelockData } from '../prepare-timelock';
import { mockExecuteTimelock } from '../mock-exec-timelock';
import { ContractTransaction } from 'ethers';

const job = async () => {
  assert(hre.network.name === 'base' || hre.network.name === 'hardhat', 'not mainnet');
  console.log('using network', hre.network.name);
  const timelock = await getTimelock(hre, '0x00000Ab6Ee5A6c1a7Ac819b01190B020F7c6599d');
  const config = await hre.ethers.getContractAt(
    'PoolConfigurator',
    '0xB40e21D5cD8E9E192B0da3107883f8b0f4e4e6E3'
  );

  const safe = '0x6F5Ae60d89dbbc4EeD4B08d08A68dD5679Ac61B4';
  const txs: ContractTransaction[] = [];

  // remove old listing contracts from all ACLs
  txs.push(
    await config.dropReserve.populateTransaction('0xdbfefd2e8460a6ee4955a68582f85708baea60a3')
  ); // remove superOETH
  txs.push(
    await config.dropReserve.populateTransaction('0xf469fbd2abcd6b9de8e169d128226c0fc90a012e')
  ); // remove pumpBTC

  const tx = await prepareTimelockData(hre, safe, txs, timelock.target);

  await mockExecuteTimelock(tx.schedule, tx.execute, 86400 * 5, 'base', async () => {});
};

job();
