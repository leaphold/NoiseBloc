const fs = require('fs');
const { Web3 } = require('web3');
const path = require('path');

const contractAddress = require('../../contracts/contractAddress.js');
console.log('CONTRACT ADDRESS: '+ contractAddress);

const contractPath = path.resolve(__dirname, '../../data', 'MyContract.json');
const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
const contractAbi = contractJson.abi;

const web3 = new Web3('http://localhost:7545');

const pitchesPath = path.join(__dirname, '../../data/pitches.json');
const jsonObject = JSON.parse(fs.readFileSync(pitchesPath, 'utf8'));

const jsonString = JSON.stringify(jsonObject);

const pitchesTxtPath = path.join(__dirname, '../../data/pitches.txt');
fs.writeFileSync(pitchesTxtPath, jsonString);

const contract = new web3.eth.Contract(contractAbi, contractAddress);
console.log(contractAddress);
web3.eth.getAccounts().then(accounts => {
  web3.eth.getBalance(accounts[0]).then(balance => {
    console.log("Balance of account[0]: ", web3.utils.fromWei(balance, 'ether'), "ETH");
  });

  // Send transaction to the first account in Ganache
  web3.eth.sendTransaction({
    from: accounts[0],
    to: accounts[0],
    value: web3.utils.toWei('1', 'ether'),
    gas: 5000000
  })
  .then(receipt => {
    console.log('Transaction receipt: ', receipt);
    // Update hash.js with the transaction hash
    const content = 'module.exports = { transactionHash: \'' + receipt.transactionHash + '\' };';
    const hashPath = path.join(__dirname, '../../data/hash.js');
    fs.writeFile(hashPath, content, (err) => {
      if (err){
        console.error('Error Writing file ', err);
      }
      else {
        console.log('File written successfully');
        console.log('Transaction hash: ', receipt.transactionHash);
      }
    });
  })
  .catch(err => {
    console.error(err);
    console.log('Error sending transaction');
    console.log(accounts[0]);
    console.log('Contract address after ERROR: '+contractAddress);
  });
});

