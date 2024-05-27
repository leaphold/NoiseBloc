const path = require('path');
const fs = require('fs');
const solc = require('solc');
const { Web3 } = require('web3');

// Compile Contract
const contractPath = path.resolve(__dirname, './', 'HashMaker.sol');
const source = fs.readFileSync(contractPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'HashMaker.sol': {
      content: source
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
};

let output;
try {
  output = JSON.parse(solc.compile(JSON.stringify(input)));
} catch (err) {
  console.error('Compilation error:', err);
  process.exit(1);
}

const contractData = output.contracts['HashMaker.sol'].HashMaker;
fs.writeFileSync(path.resolve(__dirname, '../data', 'MyContract.json'), JSON.stringify(contractData));

// Deploy Contract
const web3 = new Web3('http://localhost:8545');
const contractABI = contractData.abi;
const contractBytecode = contractData.evm.bytecode.object;

async function deployContract() {
  const accounts = await web3.eth.getAccounts();
  console.log('Deploying contract from account:', accounts[0]);

  const contract = new web3.eth.Contract(contractABI);

  try {
    const contractInstance = await contract.deploy({
      data: '0x' + contractBytecode
    }).send({
      from: accounts[0],
      gas: 5000000
    });

    console.log('Contract deployed at address:', contractInstance.options.address);

    // Write the contract address to a file
    const contractAddressPath = path.resolve(__dirname, '../contracts', 'contractAddress.js');
    fs.writeFileSync(contractAddressPath, `module.exports = { contractAddress: '${contractInstance.options.address}' };`);
    console.log('Contract address written to file');
  } catch (err) {
    console.error('Deployment error:', err);
    process.exit(1);
  }
}

deployContract();
