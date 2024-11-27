// update the oracles on the zksync network to use chainlink
// schedule https://era.zksync.network/tx/0xa88b211d8bba2d486f87498d6acf336bc607ea240e2de06784a023aea9921c4e

import hre from 'hardhat';
import assert from 'assert';
import { getTimelock, prepareTimelockData } from '../prepare-timelock';
import { mockExecuteTimelock } from '../mock-exec-timelock';
import { ContractTransaction } from 'ethers';

const job = async () => {
  assert(
    hre.network.name === 'zksync' ||
      hre.network.name === 'hardhat' ||
      hre.network.name === 'tenderly',
    'not mainnet'
  );
  console.log('using network', hre.network.name);
  const timelock = await getTimelock(hre, '0x861cC6724D0aA7Ec7a868887643e682b1c16aeeC');
  const safe = '0x1890F9204882dfa1B8f0AEaF56ae9b2ed149D18d';
  const txs: ContractTransaction[] = [];

  const oracle = await hre.ethers.getContractAt(
    'AaveOracle',
    '0x785765De3E9ac3D8eEb42B4724A7FEA8990142B8'
  );

  // updated the zksync oracles
  txs.push(
    await oracle.setAssetSources.populateTransaction(
      [
        '0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4', // usdc
        '0xEdAc06D73DbdD3460B5728E4bBE9862b04Ac198a', // weth
        '0x493257fd37edb34451f62edf8d2a0c418852ba4c', // usdt
        '0x503234f203fc7eb888eec8513210612a43cf6115', // lusd
        '0xbbeb516fb02a01611cbbe0453fe3c580d7281011', // wbtc
        '0xbbeb516fb02a01611cbbe0453fe3c580d7281011', // wstETH
      ],
      [
        '0x1824D297C6d6D311A204495277B63e943C2D376E', // usdc
        '0x6D41d1dc818112880b40e26BD6FD347E41008eDA', // weth
        '0xE8D6d2dffCFfFc6b1f3606b7552e80319D01A8E9', // usdt
        '0x1824D297C6d6D311A204495277B63e943C2D376E', // lusd
        '0x4Cba285c15e3B540C474A114a7b135193e4f1EA6', // wbtc
        '0xdea7DE07B8275564Af6135F7E9340411246EB7A2', // wstETH
      ]
    )
  );

  const tx = await prepareTimelockData(hre, safe, txs, timelock.target);
  await mockExecuteTimelock(tx.schedule, tx.execute, 86400 * 5, 'zksync', async () => {});
};

job();
