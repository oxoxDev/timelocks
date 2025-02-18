import hre from 'hardhat';
import assert from 'assert';
import { getTimelock, prepareTimelockData } from '../prepare-timelock';
import { ContractTransaction } from 'ethers';
import { mockExecuteTimelock } from '../mock-exec-timelock';

const job = async () => {
  assert(
    hre.network.name === 'hardhat' ||
    hre.network.name === 'tenderly' ||
    hre.network.name === 'zksync',
    'not mainnet'
  );
  console.log(`Using the network ${hre.network.name}`);

  const TIMELOCK = await getTimelock(hre, '0x861cC6724D0aA7Ec7a868887643e682b1c16aeeC');
  const SAFE = '0x0F6e98A756A40dD050dC78959f45559F98d3289d';
  const POOL_ADDRESS_PROVIDER = '0x4f285Ea117eF0067B59853D6d16a5dE8088bA259';
  const NEW_POOL_IMPL = '0x9f98c6FAf71ae57d61124b1e0D572d2866BC5B05'
  const poolAddressProvider = await hre.ethers.getContractAt(
    'PoolAddressesProvider',
    POOL_ADDRESS_PROVIDER
  );
  let data = poolAddressProvider.interface.encodeFunctionData('setPoolImpl', [NEW_POOL_IMPL]);
  const txs: ContractTransaction[] = [];

  txs.push({
    to: POOL_ADDRESS_PROVIDER,
    data: data,
  });

  const KEYRING = '0x6BcDee9b8e016A1B2d50F2fe5f95F5Dd20cBE866';

  // Create an interface for the NEW_POOL_IMPL contract with setKeyring method
  const poolContract = new hre.ethers.Interface([
    'function setKeyring(address keyring_) external'
  ]);

  data = poolContract.encodeFunctionData('setKeyring', [KEYRING]);

  console.log('Setting keyring to', data);

  txs.push({
    to: NEW_POOL_IMPL, 
    data: data,
  });
  
  const tx = await prepareTimelockData(hre, SAFE, txs, TIMELOCK.target);

  await mockExecuteTimelock(tx.schedule,tx.execute,86400 * 5,'zksync',async()=>{
    console.log('executed');
  })
};

job();  