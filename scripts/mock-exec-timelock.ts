import { ContractTransaction } from 'ethers';
import hre, { ethers, network } from 'hardhat';
import { timelockConfig } from '../config';

export const mockExecuteTimelock = async (
  scheduleTx: ContractTransaction,
  executeTx: ContractTransaction,
  minDelay: number,
  mockNetwork = 'hardhat',
  callback: () => Promise<void>
) => {
  if (network.name !== 'hardhat') {
    console.log('to mock the execution of this script, use a fork network');
    return;
  }

  // @ts-ignore
  const gnosisSafe = timelockConfig.gnosisSafes[mockNetwork];

  console.log('impersonating gnosis safe', gnosisSafe);
  await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [gnosisSafe],
  });

  const signer = await ethers.getSigner(gnosisSafe);
  await hre.network.provider.send('hardhat_setBalance', [
    gnosisSafe,
    '0x1000000000000000000', // Set balance to a large amount
  ]);

  const tx1 = await signer.sendTransaction(scheduleTx);
  console.log('scheduling timelock transaction', tx1.hash);

  // Simulate waiting for a few days
  await hre.network.provider.send('evm_increaseTime', [minDelay]);
  await hre.network.provider.send('evm_mine');

  const tx2 = await signer.sendTransaction(executeTx);
  console.log('executing timelock transaction', tx2.hash);

  await callback();
};
