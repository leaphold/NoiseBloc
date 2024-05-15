const fs = require('fs');
const { Web3 } = require('web3');
const output = require('../data/MyContract.json');

const web3 = new Web3('http://localhost:8545');
const contractABI = output.abi;
const contractBytecode = output.evm.bytecode.object;

async function deployContract() {
  const accounts = await web3.eth.getAccounts();

  const contract = new web3.eth.Contract(contractABI);

  let contractInstance;
  try {
    contractInstance = await contract.deploy({
      data: '0x' + contractBytecode
    }).send({
      from: accounts[0],
      gas: '5000000'
    });
  } catch (err) {
    console.error('Deployment error:', err);
    return;
  }

  console.log('Contract deployed at address:', contractInstance.options.address);

  // Write the contract address to a file
  fs.writeFile('contractAddress.js', `module.exports = '${contractInstance.options.address}';`, (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('Contract address written to file');
    }
  });

  return contractInstance.options.address;
}

deployContract();
