import { task } from 'hardhat/config';
import { waitForTx } from './utils';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

/**
 * For a newly created timelock, this setups the admin roles properly.
 */
task(`transfer-timelock-admin`)
  .addParam('admin')
  .addParam('canceller')
  .setAction(async (params, hre: HardhatRuntimeEnvironment) => {
    if (hre.network.name === 'hardhat') throw new Error('invalid network');

    console.log('setting admin to', params.admin);
    console.log('setting canceller to', params.canceller);

    const timelockD = await hre.deployments.get('TimelockControllerEnumerable');
    const timelock = await hre.ethers.getContractAt(
      'TimelockControllerEnumerable',
      timelockD.address
    );

    console.log('granting executor role to multisig', params.admin);
    await waitForTx(await timelock.grantRole(await timelock.EXECUTOR_ROLE(), params.admin));

    console.log('granting cancellor role to multisig', params.admin);
    await waitForTx(await timelock.grantRole(await timelock.CANCELLER_ROLE(), params.admin));

    console.log('granting cancellor role to canceller', params.canceller);
    await waitForTx(await timelock.grantRole(await timelock.CANCELLER_ROLE(), params.canceller));

    console.log('granting proposer role to multisig', params.admin);
    await waitForTx(await timelock.grantRole(await timelock.PROPOSER_ROLE(), params.admin));

    console.log('revoking admin role from deployer', params.admin);
    await waitForTx(await timelock.revokeRole(await timelock.TIMELOCK_ADMIN_ROLE(), params.admin));
  });
