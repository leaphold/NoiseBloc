This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.




# SmartContract
## Order of procedure

### Preparation
1. "compileContract.js" creates a json "MyContract.json" with the abi and bytecode. ABI is used by js bytecode by the blockchain.

2. Start Ganache - "ganache" in the terminal.

3. deploy.js deploys your contract to the local ethereum network on your computer created by runnin ganache (and it need to be running). 

### Work with the Sound

1. wavToJson.js takes a sound file and creates a json file () with the top 16 pitches every 5 second.

2. in stringufySoundData - update the actual adress of the running contract.  it is now stringifying my pitchesJson. The code interacts with the deployed ETh contract by calling a function and tehn stores the resulting transaction hash in hash.js.  The code reads the pitches.json converts it to a string and then passes this string to the hash function of the contract which is now deployed and then stores the hash which is coming from those pitches from the wav file to json to string to ahash. hash.js can now be used to create a modifiedpitches.json

3. modifyPitchJson used to modify the original pitches.json to a pitchesMod to use it to inject the original audio.

4.Inject the new pitches to teh original sound using modifyOriginalWav.py which exports the new file with modified pitches. Be sure to change the file to original in the program. 



//////////////////////////////
From your description, it seems like you're trying to demonstrate a process of interacting with a smart contract on the Ethereum network, processing a sound file, and then modifying that sound file based on the data from the smart contract.

If you're just demonstrating this process and don't actually need to handle file uploads from a client, you don't necessarily need to start a server. You can run your Node.js scripts directly from the command line.

Here's a simplified version of the process you described:

Compile and deploy the contract:

Run node compileContract.js to compile the contract and generate the ABI and bytecode.
Make sure Ganache is running.
Run node deploy.js to deploy the contract to your local Ethereum network.
Process the sound file:

Run node wavToJson.js to convert the sound file to JSON format.
Interact with the contract and modify the sound data:

Update the contract address in stringifySoundData.js.
Run node stringifySoundData.js to interact with the contract and generate hash.js.
Run node modifyPitchJson.js to modify the original JSON data.
Modify the original sound file:

Run python modifyOriginalWav.py to inject the new pitches into the original sound file.
This process can be run entirely from the command line, without needing to start a server or handle file uploads from a client. If you need to demonstrate this process in a more interactive way, you could create a simple command-line interface (CLI) for your scripts using a library like Inquirer.js.





                                                                                      
RPC Listening on 127.0.0.1:8545                                                       
eth_accounts                                                                          
eth_getBlockByNumber                                                                  
eth_blockNumber                                                                       
eth_sendTransaction                                                                   
                                                                                      
  Transaction: 0x07e7b184c1eee289c842614c4b3730094fb1da3a37d11efe78745f057686e903     
  Contract created: 0xabc869df33adb631b6fd72ef3c1caaff3bb88228                        
  Gas usage: 215308                                                                   
  Block number: 1                                                                     
  Block time: Tue May 14 2024 10:48:25 GMT+0200 (Central European Summer Time)        
                                                                                      
eth_getTransactionReceipt                                                             
eth_blockNumber                                                                       
                                                                                      

