const fs = require('fs');
const path = require('path');

// Import the transaction hash
const { transactionHash } = require(path.resolve(__dirname, '../../data/hash.js'));

// Remove the '0x' prefix and split the hash into pairs of characters
const hashPairs = transactionHash.slice(2).match(/.{1,2}/g);
console.log('Hash pairs: ', hashPairs);
// Convert the pairs into decimal numbers between 1 and 16
const hashNumbers = hashPairs.map(pair => (parseInt(pair, 16) % 16) + 1);
console.log('Hash numbers: ', hashNumbers);


// Read the pitches from the JSON file
const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../data/pitches.json'), 'utf8'));

// Modify the pitches using the hash numbers
for (let i = 0; i < data.length; i++) {
  for (let j = 0; j < data[i].pitches.length; j++) {
    data[i].pitches[j] += hashNumbers[(i * data[i].pitches.length + j) % hashNumbers.length];
  }
}

// Write the modified pitches back to the JSON file
fs.writeFileSync(path.resolve(__dirname, '../../data/pitchesMod.json'), JSON.stringify(data, null, 2));
console.log('Pitches modified successfully');
