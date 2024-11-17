// Upgrade AERO/USDC Pool to stake in the Aerodrome Guage
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
    'not mainnet'
  );
  console.log('using network', hre.network.name);
  const timelock = await getTimelock(hre, '0x00000Ab6Ee5A6c1a7Ac819b01190B020F7c6599d');
  const config = await hre.ethers.getContractAt(
    'PoolConfigurator',
    '0xB40e21D5cD8E9E192B0da3107883f8b0f4e4e6E3'
  );
  const acl = await hre.ethers.getContractAt(
    'ACLManager',
    '0x1cc993f2C8b6FbC43a9bafd2A44398E739733385'
  );

  const safe = '0x6F5Ae60d89dbbc4EeD4B08d08A68dD5679Ac61B4';
  const txs: ContractTransaction[] = [];

  // remove old listing contracts from all ACLs
  const abi = new hre.ethers.AbiCoder();
  const encodedParams = abi.encode(
    ['address', 'address'],
    ['0x4F09bAb2f0E15e2A078A227FE1537665F55b8360', '0xF46C11dC451303170ac52D6039a18E1a9610B177']
  );

  txs.push(await acl.addPoolAdmin.populateTransaction(timelock.target)); // add pool admin to timelock
  txs.push(
    await config.updateAToken.populateTransaction({
      asset: '0x6cDcb1C4A4D1C3C6d054b27AC5B77e89eAFb971d',
      treasury: '0x6F5Ae60d89dbbc4EeD4B08d08A68dD5679Ac61B4',
      incentivesController: '0x73a7a4B40f3FE11e0BcaB5538c75D3B984082CAE',
      name: 'ZeroLend AEROUSDC_LP',
      symbol: 'z0AEROUSDC_LP',
      implementation: '0xD8e429568F57f21C111faf1Eab1ddB5107Cc9817',
      params: encodedParams, // 'abi.encode(GAUGE, address(strategy))',
    })
  ); // upgrade aerousdc_lp

  const tx = await prepareTimelockData(hre, safe, txs, timelock.target);

  const atoken = await hre.ethers.getContractAt(
    'AToken',
    '0xB6ccD85f92FB9a8bBC99b55091855714aAeEBFEE'
  );

  console.log('atoken version before timelock', await atoken.ATOKEN_REVISION());
  await mockExecuteTimelock(tx.schedule, tx.execute, 86400 * 5, 'base', async () => {
    console.log('atoken version before timelock', await atoken.ATOKEN_REVISION());
  });
};

job();
