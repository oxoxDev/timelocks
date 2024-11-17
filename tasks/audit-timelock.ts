import { AccessControlEnumerable } from '../typechain-types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { prepareTimelockData } from '../scripts/prepare-timelock';
import { task } from 'hardhat/config';
import { timelockConfig } from '../config';
import assert from 'assert';

task(`audit-timelock`).setAction(async (params, hre: HardhatRuntimeEnvironment) => {
  if (hre.network.name === 'hardhat') throw new Error('invalid network');

  const coldWallet = timelockConfig.coldWallet.toLowerCase();
  const hotWallet = timelockConfig.hotWallet.toLowerCase();
  // @ts-ignore
  const gnosisSafe = timelockConfig.gnosisSafes[hre.network.name].toLowerCase();
  assert(gnosisSafe && gnosisSafe.length > 0, 'no gnosis safe found');

  const timelockD = await hre.deployments.get('TimelockControllerEnumerable');
  const timelock = await hre.ethers.getContractAt(
    'TimelockControllerEnumerable',
    timelockD.address
  );

  const _hash = (id: string) => hre.ethers.solidityPackedKeccak256(['string'], [id]);

  // CHANGE THIS TO ADD OR REMOVE ROLES
  const roles = [
    {
      id: 'CANCELLER_ROLE',
      hash: _hash('CANCELLER_ROLE'),
      wallets: [coldWallet, gnosisSafe],
    },
    {
      id: 'EXECUTOR_ROLE',
      hash: _hash('EXECUTOR_ROLE'),
      wallets: [coldWallet, hotWallet, gnosisSafe],
    },
    {
      id: 'PROPOSER_ROLE',
      hash: _hash('PROPOSER_ROLE'),
      wallets: [coldWallet, gnosisSafe], // todo add governance contract here and remove cold wallet
    },
    {
      id: 'TIMELOCK_ADMIN_ROLE',
      hash: _hash('TIMELOCK_ADMIN_ROLE'),
      wallets: [timelock.target.toString().toLowerCase()],
    },
    {
      id: 'DEFAULT_ADMIN_ROLE',
      hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      wallets: [],
    },
  ];

  const txs = [];

  console.log('using timelock at', timelock.target);
  console.log('using gnosisSafe at', gnosisSafe);
  console.log('using coldWallet at', coldWallet);

  for (let j = 0; j < roles.length; j++) {
    const role = roles[j];
    const rawRole = role.id;
    const roleHash = role.hash;

    const admins = await _checkRole(timelock, 'timelock', rawRole, roleHash);

    // if the wallet is not supposed to be included then we remove
    for (let i = 0; i < admins.length; i++) {
      const admin = admins[i].toLowerCase();
      if (roles[j].wallets.includes(admin)) continue;
      console.log('>  revoke role:', rawRole, 'for', admin);
      txs.push(await timelock.revokeRole.populateTransaction(roleHash, admin));
    }

    // if the wallet is not included then we add
    for (let i = 0; i < roles[j].wallets.length; i++) {
      const wallet = roles[j].wallets[i].toLowerCase();
      if (admins.includes(wallet)) continue;
      console.log('>  grant role:', rawRole, 'to', wallet);
      txs.push(await timelock.grantRole.populateTransaction(roleHash, wallet));
    }
  }

  // emit out the txs for the timelock
  await prepareTimelockData(hre, gnosisSafe, txs, timelock.target);
});

const _checkRole = async (
  inst: AccessControlEnumerable,
  name: string,
  roleName: string,
  role: string
) => {
  const admins = await _getRoles(inst, role);
  if (admins.length == 0) return [];

  console.log(`  checking ${roleName} roles for ${name}`);
  for (let i = 0; i < admins.length; i++) {
    console.log(`    user ${i + 1} is`, admins[i]);
  }

  return admins;
};

const _getRoles = async (inst: AccessControlEnumerable, role: string) => {
  const admins: string[] = [];
  const count = await inst.getRoleMemberCount(role);
  for (let i = 0; i < count; i++) {
    const members = await inst.getRoleMember(role, i);
    admins.push(members.toLowerCase());
  }
  return admins;
};
