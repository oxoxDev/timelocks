// import
import { ethers } from 'ethers';
import { getCreate2Address } from './create2';

// declare deployment parameters
import contractArtifact from '../artifacts/contracts/TimelockControllerEnumerable.sol/TimelockControllerEnumerable.json';

// @ts-ignore
const constructorTypes = contractArtifact.abi
  .find((v) => v.type === 'constructor')
  ?.inputs.map((t) => t.type);

const deployer = '0x0F6e98A756A40dD050dC78959f45559F98d3289d';

const constructorArgs: any[] = [
  86400 * 5, // uint256 minDelay,
  [], // address[] memory proposers,
  [], // address[] memory executors,
  deployer, // address admin
];
const factoryAddress = '0x179F0B499D21488f32B361671F5a01a4EEFC30d7';
const salt = '0xbb3b5f58de484af29acbcad59946d79acf7f48e743edc3596103467b5f907b20';

console.log('constructor parameters', constructorTypes, constructorArgs);

const computedAddress = getCreate2Address({
  salt: salt,

  factoryAddress,
  contractBytecode: contractArtifact.bytecode,
  constructorTypes: constructorTypes,
  constructorArgs: constructorArgs,
});

console.log('computed address', computedAddress);
