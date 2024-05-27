const assert = require('chai').assert;
const { Web3 } = require('web3');
const output = require('../data/MyContract.json');
const contractAddress = require('../contracts/contractAddress.js');

const web3 = new Web3('http://localhost:8545');
const contractABI = output.abi;

describe('MyContract', () => {
  let contract;
  let accounts;

  before(async () => {
    accounts = await web3.eth.getAccounts();
    contract = new web3.eth.Contract(contractABI, contractAddress);
  });

  it('should deploy the contract', () => {
    assert.ok(contract.options.address);
  });

it('should interact with the contract', async () => {
  const method = 'hash';
  const args = ['testString'];

  let result;
  try {
    result = await contract.methods[method](...args).send({ from: accounts[0] });
  } catch (err) {
    console.error(err); // Add this line to print the error message
    assert.fail(`Contract interaction failed: ${err}`);
  }

  assert.ok(result);
});
});
