// Updates the timelock contract with new ACLs and listing contracts on base
import hre from 'hardhat';
import assert from 'assert';
import { getTimelock, prepareTimelockData } from '../prepare-timelock';
import { mockExecuteTimelock } from '../mock-exec-timelock';
import { ContractTransaction } from 'ethers';

const job = async () => {
  assert(hre.network.name === 'base' || hre.network.name === 'hardhat', 'not mainnet');
  console.log('using network', hre.network.name);
  const timelock = await getTimelock(hre, '0x00000Ab6Ee5A6c1a7Ac819b01190B020F7c6599d');
  const acl = await hre.ethers.getContractAt(
    'ACLManager',
    '0x1cc993f2C8b6FbC43a9bafd2A44398E739733385'
  );
  const config = await hre.ethers.getContractAt(
    'PoolConfigurator',
    '0xB40e21D5cD8E9E192B0da3107883f8b0f4e4e6E3'
  );

  const hwWalletOld = '0x6aac0942B8147BffAB73789a82EE12fDA7735BAc';
  const hwWalletToAdd = '0xa8E39bBced0E29a07E07826bc61Cc02D597236F2';
  const safe = '0x6F5Ae60d89dbbc4EeD4B08d08A68dD5679Ac61B4';
  const listingContract = '0xe5D82c4d58927B703c6f0cf28513FAac5bE2776e';

  const listingContractToRemove = '0x06EBBfE85beC9e21E47F5d53CE56905F1D34AE48';

  const txs: ContractTransaction[] = [];

  // remove old listing contracts from all ACLs
  const PROPOSER_ROLE = await timelock.PROPOSER_ROLE();
  txs.push(await timelock.revokeRole.populateTransaction(PROPOSER_ROLE, hwWalletOld));
  txs.push(await timelock.grantRole.populateTransaction(PROPOSER_ROLE, hwWalletOld));
  txs.push(await acl.removePoolAdmin.populateTransaction(listingContractToRemove));
  txs.push(await acl.addEmergencyAdmin.populateTransaction(hwWalletOld));
  txs.push(await acl.removeRiskAdmin.populateTransaction(hwWalletOld));

  // add new listing contract to all ACLs
  txs.push(await acl.addPoolAdmin.populateTransaction(listingContract));
  txs.push(await acl.removeAssetListingAdmin.populateTransaction(safe));
  txs.push(await acl.addRiskAdmin.populateTransaction(safe));
  txs.push(await acl.addRiskAdmin.populateTransaction(hwWalletToAdd));
  txs.push(await acl.addEmergencyAdmin.populateTransaction(hwWalletOld));
  txs.push(await acl.addEmergencyAdmin.populateTransaction(safe));

  // update delay to 3 days
  txs.push(await timelock.updateDelay.populateTransaction(86400 * 3));

  const tx = await prepareTimelockData(hre, safe, txs, timelock.target);

  await mockExecuteTimelock(tx.schedule, tx.execute, 86400 * 5, 'base', async () => {
    console.log(
      'listing contract is pool admin after execution',
      await acl.isPoolAdmin(listingContract)
    );

    // now stUSDA & USD0++ PT must be listed
    // console.log('timelock delay after execution:', (await timelock.getMinDelay()).toString());
    // console.log('reserves count before timelock:', reservesCount.toString());
    // console.log('reserves count after execution:', (await pool.getReservesCount()).toString());
  });
};

job();
