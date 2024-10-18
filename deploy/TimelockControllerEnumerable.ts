import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { buildBytecode, saltToHex } from '../scripts/create2';
import { network } from 'hardhat';

async function main(hre: HardhatRuntimeEnvironment) {
  const { deployments } = hre;

  const constructorArgs: any[] = [
    86400 * 5, // uint256 minDelay,
    [], // address[] memory proposers,
    [], // address[] memory executors,
    '0x0F6e98A756A40dD050dC78959f45559F98d3289d', // address admin
  ];

  const factory = await hre.ethers.getContractFactory('TimelockControllerEnumerable');
  const constructorTypes = factory.interface.deploy.inputs.map((i) => i.type);

  const create2 = await hre.ethers.getContractAt(
    'Create2Deployer',
    '0x179F0B499D21488f32B361671F5a01a4EEFC30d7'
  );

  const byteCode = buildBytecode(constructorTypes, constructorArgs, factory.bytecode);
  const salt = '0xbb3b5f58de484af29acbcad59946d79acf7f48e743edc3596103467b5f907b20';

  const tx = await create2.deploy(byteCode, salt);
  const txR = await tx.wait(1);

  // @ts-ignore
  const address = txR?.logs?.[txR?.logs.length - 1].args[0] || '';

  console.log('TimelockControllerEnumerable deployed to:', address);

  if (network.name == 'hardhat') return;
  await deployments.save('TimelockControllerEnumerable', {
    address: address,
    args: constructorArgs,
    abi: factory.interface.format(),
  });

  await hre.run('verify:verify', {
    address: address,
    constructorArguments: constructorArgs,
  });
}

main.tags = ['TimelockControllerEnumerable'];
export default main;
