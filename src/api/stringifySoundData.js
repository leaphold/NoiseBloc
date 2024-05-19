const fs = require('fs');
const { Web3 } = require('web3');
const path = require('path');

// Import contractAddress from the specified path
const { contractAddress } = require('../../contracts/contractAddress.js');
console.log('CONTRACT ADDRESS: ' + contractAddress);

const contractPath = path.resolve(__dirname, '../../data', 'MyContract.json');
const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
const contractAbi = contractJson.abi;

const web3 = new Web3('http://localhost:8545');

const pitchesPath = path.join(__dirname, '../../data/pitches.json');
const jsonObject = JSON.parse(fs.readFileSync(pitchesPath, 'utf8'));

const jsonString = JSON.stringify(jsonObject);

const pitchesTxtPath = path.join(__dirname, '../../data/pitches.txt');
fs.writeFileSync(pitchesTxtPath, jsonString);

const contract = new web3.eth.Contract(contractAbi, contractAddress);
console.log('Using contract at address: ' + contractAddress);

web3.eth.getAccounts().then(accounts => {
  web3.eth.getBalance(accounts[0]).then(balance => {
    console.log("Balance of account[0]: ", web3.utils.fromWei(balance, 'ether'), "ETH");
  });

  // Call the createHash function on the contract
  contract.methods.createHash(jsonString).send({
    from: accounts[0],
    gas: 5000000
  })
  .then(receipt => {
    console.log('Transaction receipt: ', receipt);

    // Extract the hash from the transaction receipt
    const hash = receipt.events.HashCreated.returnValues.hash;
    console.log('Hash: ', hash);    
    // Update hash.js with the hash
    const content = 'module.exports = { transactionHash: \'' + hash + '\' };';
    const hashPath = path.join(__dirname, '../../data/hash.js');
    fs.writeFile(hashPath, content, (err) => {
      if (err) {
        console.error('Error writing file ', err);
      } else {
        console.log('File written successfully');
        console.log('Hash: ', hash);
      }
    });
  })
  .catch(err => {
    console.error('Error sending transaction: ', err);
  });
});
