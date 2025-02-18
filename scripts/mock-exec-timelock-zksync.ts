import { ContractTransaction } from 'ethers';
import hre, { ethers, network } from 'hardhat';
import { timelockConfig } from '../config';

export const executeTimelockZkSync = async (
  scheduleTx: ContractTransaction,
  executeTx: ContractTransaction,
  minDelay: number,
  callback: () => Promise<void>
) => {
  if (network.name !== 'zksync') {
    console.log('This script is only for zkSync execution.');
    return;
  }

  // Fetch a signer from Hardhat
  const [signer] = await hre.ethers.getSigners();
  console.log('Using signer:', signer.address);

  // Retrieve the Gnosis Safe address from the config
  const gnosisSafe = timelockConfig.gnosisSafes['zksync'];
  if (!gnosisSafe) {
    throw new Error('Gnosis Safe address not configured for zkSync.');
  }

  console.log('Executing timelock from Gnosis Safe:', gnosisSafe);

  // Schedule the timelock transaction
  console.log('Scheduling timelock transaction...');
  const tx1 = await signer.sendTransaction(scheduleTx);
  await tx1.wait();
  console.log('Scheduled timelock transaction:', tx1.hash);

  // Wait for the timelock delay (Real time instead of Hardhat EVM manipulation)
  console.log(`Waiting for timelock delay of ${minDelay} seconds...`);
  await new Promise((resolve) => setTimeout(resolve, minDelay * 1000));

  // Execute the timelock transaction
  console.log('Executing timelock transaction...');
  const tx2 = await signer.sendTransaction(executeTx);
  await tx2.wait();
  console.log('Executed timelock transaction:', tx2.hash);

  // Run the callback function
  await callback();
};
