import { getTimelock, prepareTimelockData } from '../prepare-timelock';

const job = async () => {
  const timelock = await getTimelock();

  const txs1 = [
    // update delay to 3 days
    await timelock.updateDelay.populateTransaction(86400 * 3),

    // add new listing contract as admin
    {
      to: '0x6C9E32e37F3377D1824304f80bD135be85f5C8c8',
      data: '0x22650caf000000000000000000000000b7f3c8c12a94caf61057c1e1909562691af2a69c',
    },
    {
      to: '0x984A0d2F68bE59FAD746A6d15B811Febf34461f4',
      data: '0x22650caf000000000000000000000000b7f3c8c12a94caf61057c1e1909562691af2a69c',
    },
    {
      to: '0x749dF84Fd6DE7c0A67db3827e5118259ed3aBBa5',
      data: '0x22650caf000000000000000000000000b7f3c8c12a94caf61057c1e1909562691af2a69c',
    },
  ];

  console.log('preparing timelock data to change delay and add new listing contracts\n');
  await prepareTimelockData(txs1);
  console.log('-----\n\n');

  const txs2 = [
    // listing of stUSDA
    {
      to: '0xB7f3c8C12a94Caf61057C1e1909562691aF2A69c',
      data: '0x22650caf000000000000000000000000b7f3c8c12a94caf61057c1e1909562691af2a69c',
    },
    // listing of USD0++ PT
    {
      to: '0xB7f3c8C12a94Caf61057C1e1909562691aF2A69c',
      data: '0x22650caf000000000000000000000000b7f3c8c12a94caf61057c1e1909562691af2a69c',
    },
  ];
  console.log('preparing timelock data to list stUSDA and USD0++ PT\n');
  await prepareTimelockData(txs2);
  console.log('-----\n\n');
};

job();
