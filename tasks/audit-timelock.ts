import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { timelockConfig } from '../config';
import assert from 'assert';

task(`audit-timelock`).setAction(async (params, hre: HardhatRuntimeEnvironment) => {
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

  // todo check roles
});
