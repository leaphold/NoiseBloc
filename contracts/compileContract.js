const path = require('path');
const fs = require('fs');
const solc = require('solc');


const contractPath = path.resolve(__dirname, './', 'HashMaker.sol');
const source = fs.readFileSync(contractPath, 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        'HashMaker.sol' : {
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
    process.exit(1);
}

const contract = output.contracts['HashMaker.sol'].HashMaker;

const contractData = {
    abi: contract.abi,
    bytecode: contract.evm.bytecode.object
};

const outputPath = path.resolve(__dirname, '../data', 'MyContract.json');
fs.writeFileSync(outputPath, JSON.stringify(contractData, null, 2), 'utf8');

console.log('Contract compiled successfully! 🎉');
