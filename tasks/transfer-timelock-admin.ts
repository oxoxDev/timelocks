import { task } from 'hardhat/config';
import { waitForTx } from './utils';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { timelockConfig } from '../config';
import assert from 'assert';
import { ZeroAddress } from 'ethers';

/**
 * For a newly created timelock, this setups the admin roles properly.
 */
task(`transfer-timelock-admin`).setAction(async (params, hre: HardhatRuntimeEnvironment) => {
  if (hre.network.name === 'hardhat') throw new Error('invalid network');

  const coldWallet = timelockConfig.coldWallet;
  const [deployer] = await hre.ethers.getSigners();

  // @ts-ignore
  const gnosisSafe = timelockConfig.gnosisSafes[hre.network.name];
  assert(gnosisSafe && gnosisSafe.length > 0, 'no gnosis safe found');

  const timelockD = await hre.deployments.get('TimelockControllerEnumerable');
  const timelock = await hre.ethers.getContractAt(
    'TimelockControllerEnumerable',
    timelockD.address
  );

  console.log('i am', deployer.address);
  console.log('using timelock at', timelock.target);
  console.log('using gnosisSafe at', gnosisSafe);
  console.log('using coldWallet at', coldWallet);

  console.log('granting executor role to everyone', ZeroAddress);
  await waitForTx(await timelock.grantRole(await timelock.EXECUTOR_ROLE(), ZeroAddress));

  console.log('granting cancellor role to multisig');
  await waitForTx(await timelock.grantRole(await timelock.CANCELLER_ROLE(), gnosisSafe));

  console.log('granting cancellor role to cold wallet');
  await waitForTx(await timelock.grantRole(await timelock.CANCELLER_ROLE(), coldWallet));

  console.log('granting proposer role to multisig');
  await waitForTx(await timelock.grantRole(await timelock.PROPOSER_ROLE(), gnosisSafe));

  console.log('granting proposer role to cold wallet (REMOVE THIS LATER)');
  await waitForTx(await timelock.grantRole(await timelock.PROPOSER_ROLE(), coldWallet));

  console.log('revoking admin role from deployer', deployer.address);
  await waitForTx(
    await timelock.revokeRole(await timelock.TIMELOCK_ADMIN_ROLE(), deployer.address)
  );
});
