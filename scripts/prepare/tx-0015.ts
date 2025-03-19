// list new assets onto the base market
// scheduled
// executed

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
  const safe = '0x6F5Ae60d89dbbc4EeD4B08d08A68dD5679Ac61B4';

  const oracle = await hre.ethers.getContractAt(
    'AaveOracle',
    '0xF49Ee3EA9C56D90627881d88004aaBDFc44Fd82c'
  );
  const acl = await hre.ethers.getContractAt(
    'ACLManager',
    '0x1cc993f2C8b6FbC43a9bafd2A44398E739733385'
  );
  const txs: ContractTransaction[] = [];

  // listing of cbETH Dec PT
  txs.push({
    to: '0x76D34c6794Bdb511eFf788585F10a1007D474Dc6',
    data: '0x107eef450000000000000000000000005213ab3997a596c75ac6ebf81f8aeb9cf9a3100700000000000000000000000000000000000000000000000000000000000001800000000000000000000000000f6e98a756a40dd050dc78959f45559f98d3289d000000000000000000000000e46c8ba948f8071b425a1f7ba45c0a65cbacea2e0000000000000000000000000000000000000000000000000000000000001f40000000000000000000000000000000000000000000000000000000000000213400000000000000000000000000000000000000000000000000000000000028a000000000000000000000000000000000000000000000000000000000000003e8000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000bb80000000000000000000000000000000000000000000000000000000000000bb8000000000000000000000000e230cf9cee7b299f69778ef950a61de0de520ba70000000000000000000000005d50be703836c330fc2d147a631cdd7bb8d7171c000000000000000000000000cbdc0aed7cdf2472784068abef23a902cafabb980000000000000000000000000000000000000000000000000000000000000012000000000000000000000000795b70fd08a538598e19a927f5400febfaeb92c7000000000000000000000000e46c8ba948f8071b425a1f7ba45c0a65cbacea2e0000000000000000000000006f5ae60d89dbbc4eed4b08d08a68dd5679ac61b400000000000000000000000073a7a4b40f3fe11e0bcab5538c75d3b984082cae00000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000000240000000000000000000000000000000000000000000000000000000000000028000000000000000000000000000000000000000000000000000000000000002e00000000000000000000000000000000000000000000000000000000000000320000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000003c000000000000000000000000000000000000000000000000000000000000000315a65726f4c656e6420505420436f696e626173652057726170706564205374616b6564204554482032354445433230323500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000147a3050542d63624554482d323544454332303235000000000000000000000000000000000000000000000000000000000000000000000000000000000000002c5a65726f4c656e64207a6b205661726961626c6520446562742050542d63624554482d323544454332303235000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000207661726961626c65446562747a3050542d63624554482d323544454332303235000000000000000000000000000000000000000000000000000000000000002a5a65726f4c656e64207a6b20537461626c6520446562742050542d63624554482d32354445433230323500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001e737461626c65446562747a3050542d63624554482d323544454332303235000000000000000000000000000000000000000000000000000000000000000000011000000000000000000000000000000000000000000000000000000000000000',
  });

  // listing of LBTC May PT
  txs.push({
    to: '0x76D34c6794Bdb511eFf788585F10a1007D474Dc6',
    data: '0x107eef450000000000000000000000005213ab3997a596c75ac6ebf81f8aeb9cf9a310070000000000000000000000000000000000000000000000000000000000000180000000000000000000000000e123f7cc644ac9dab93cf53874fd2f2e6d98166b0000000000000000000000005d746848005507da0b1717c137a10c30ad9ee3070000000000000000000000000000000000000000000000000000000000001388000000000000000000000000000000000000000000000000000000000000157c00000000000000000000000000000000000000000000000000000000000028a000000000000000000000000000000000000000000000000000000000000003e8000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000bb80000000000000000000000000000000000000000000000000000000000000bb8000000000000000000000000e230cf9cee7b299f69778ef950a61de0de520ba70000000000000000000000005d50be703836c330fc2d147a631cdd7bb8d7171c000000000000000000000000cbdc0aed7cdf2472784068abef23a902cafabb980000000000000000000000000000000000000000000000000000000000000008000000000000000000000000795b70fd08a538598e19a927f5400febfaeb92c70000000000000000000000005d746848005507da0b1717c137a10c30ad9ee3070000000000000000000000006f5ae60d89dbbc4eed4b08d08a68dd5679ac61b400000000000000000000000073a7a4b40f3fe11e0bcab5538c75d3b984082cae00000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000000240000000000000000000000000000000000000000000000000000000000000028000000000000000000000000000000000000000000000000000000000000002e00000000000000000000000000000000000000000000000000000000000000320000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000003c000000000000000000000000000000000000000000000000000000000000000225a65726f4c656e64205054204c6f6d62617264204c4254432032394d41593230323500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000137a3050542d4c4254432d32394d41593230323500000000000000000000000000000000000000000000000000000000000000000000000000000000000000002b5a65726f4c656e64207a6b205661726961626c6520446562742050542d4c4254432d32394d415932303235000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001f7661726961626c65446562747a3050542d4c4254432d32394d4159323032350000000000000000000000000000000000000000000000000000000000000000295a65726f4c656e64207a6b20537461626c6520446562742050542d4c4254432d32394d4159323032350000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001d737461626c65446562747a3050542d4c4254432d32394d41593230323500000000000000000000000000000000000000000000000000000000000000000000011000000000000000000000000000000000000000000000000000000000000000',
  });

  // listing of ZAI Stablecoin
  txs.push({
    to: '0x76D34c6794Bdb511eFf788585F10a1007D474Dc6',
    data: '0x107eef450000000000000000000000005213ab3997a596c75ac6ebf81f8aeb9cf9a31007000000000000000000000000000000000000000000000000000000000000018000000000000000000000000078ad3d53045b6582841e2a1a688c52be2ca2a7a700000000000000000000000069000dfd5025e82f48eb28325a2b88a241182ced0000000000000000000000000000000000000000000000000000000000001388000000000000000000000000000000000000000000000000000000000000157c00000000000000000000000000000000000000000000000000000000000028a000000000000000000000000000000000000000000000000000000000000003e8000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000000bb80000000000000000000000000000000000000000000000000000000000000bb8000000000000000000000000e230cf9cee7b299f69778ef950a61de0de520ba70000000000000000000000005d50be703836c330fc2d147a631cdd7bb8d7171c000000000000000000000000cbdc0aed7cdf2472784068abef23a902cafabb980000000000000000000000000000000000000000000000000000000000000012000000000000000000000000795b70fd08a538598e19a927f5400febfaeb92c700000000000000000000000069000dfd5025e82f48eb28325a2b88a241182ced0000000000000000000000006f5ae60d89dbbc4eed4b08d08a68dd5679ac61b400000000000000000000000073a7a4b40f3fe11e0bcab5538c75d3b984082cae00000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000000220000000000000000000000000000000000000000000000000000000000000026000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000002e00000000000000000000000000000000000000000000000000000000000000320000000000000000000000000000000000000000000000000000000000000036000000000000000000000000000000000000000000000000000000000000000175a65726f4c656e64205a414920537461626c65636f696e00000000000000000000000000000000000000000000000000000000000000000000000000000000057a305a4149000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001d5a65726f4c656e64207a6b205661726961626c652044656274205a414900000000000000000000000000000000000000000000000000000000000000000000117661726961626c65446562747a305a4149000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001b5a65726f4c656e64207a6b20537461626c652044656274205a41490000000000000000000000000000000000000000000000000000000000000000000000000f737461626c65446562747a305a4149000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011000000000000000000000000000000000000000000000000000000000000000',
  });

  // update anzen oracle
  txs.push({
    to: oracle.target.toString(),
    data: oracle.interface.encodeFunctionData('setAssetSources', [
      ['0x04d5ddf5f3a8939889f11e97f8c4bb48317f1938'],
      ['0xe25969e2fa633a0c027fab8f30fc9c6a90d60b48'],
    ]),
  });

  // give HW risk rights
  txs.push({
    to: acl.target.toString(),
    data: acl.interface.encodeFunctionData('addRiskAdmin', [
      '0x6aac0942B8147BffAB73789a82EE12fDA7735BAc',
    ]),
  });

  const tx = await prepareTimelockData(hre, safe, txs, timelock.target);
  // const reservesCount = await pool.getReservesCount();
  // console.log('reserves count', reservesCount.toString());
  await mockExecuteTimelock(tx.schedule, tx.execute, 86400 * 5, 'base', async () => {
    // const reservesCountAfter = await pool.getReservesCount();
    // console.log('reserves count after', reservesCountAfter.toString());
  });
};

job();
