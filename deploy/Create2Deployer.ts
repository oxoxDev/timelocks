import { HardhatRuntimeEnvironment } from 'hardhat/types';

async function main(hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log('i am', deployer);

  const deployment = await deploy('Create2Deployer', {
    from: deployer,
    contract: 'Create2Deployer',
    autoMine: true,
    log: true,
  });

  console.log('deployed at', deployment.address);

  if (hre.network.name !== 'hardhat')
    await hre.run('verify:verify', {
      address: deployment.address,
    });
}

main.tags = ['Create2Deployer'];
export default main;
