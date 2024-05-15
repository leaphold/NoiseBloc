const path = require('path');
const fs = require('fs');
const solc = require('solc');

const contractPath = path.resolve(__dirname, './', 'HashMaker.sol');
const source = fs.readFileSync(contractPath, 'utf8');

var input = {
    language: 'Solidity',
    sources: {
        'MyContract.sol' : {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [ '*' ]
            }
        }
    }
}; 

let output;
try {
  output = JSON.parse(solc.compile(JSON.stringify(input)));
} catch (err) {
  console.error('Compilation error:', err);
  return;
}

fs.writeFileSync(path.resolve(__dirname, '../data', 'MyContract.json'), JSON.stringify(output.contracts['MyContract.sol'].HashMaker));

console.log('Contract compiled successfully! 🎉');
