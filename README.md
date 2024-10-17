# ZeroLend Timelock

This repo keeps track of all the various timelock contracts deployed on ZeroLend across various chains. This repo is also used to prepare the transaction data for the various timelocks.

Each timelock is set for 5 days and has the following permissions enabled.

| Role      | Address                                                                                     | Description                                        |
| --------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Proposer  | Gnosis Multisig                                                                             | The 3/5 team multisig                              |
| Proposer  | Governor Contract                                                                           | The DAO Governance contract                        |
| Executor  | [0x0000.....00000](https://etherscan.io/address/0x0000000000000000000000000000000000000000) | Anyone can excute scheduled transctions once ready |
| Canceller | [0x6aac.....35bac](https://etherscan.io/address/0x6aac0942b8147bffab73789a82ee12fda7735bac) | Cold wallet                                        |
| Canceller | Gnosis Multisig                                                                             | The 3/5 team multisig                              |
| Canceller | Governor Contract                                                                           | The DAO Governance contract                        |

The deployed addresses for the various timelocks can be found here.

| Ethereum Network | Timelock Address                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Mainnet          | [0x00000ab6ee5a6c1a7ac819b01190b020f7c6599d](https://etherscan.io/address/0x00000ab6ee5a6c1a7ac819b01190b020f7c6599d)    |
| Linea            | [0x00000ab6ee5a6c1a7ac819b01190b020f7c6599d](https://lineascan.build/address/0x00000ab6ee5a6c1a7ac819b01190b020f7c6599d) |
