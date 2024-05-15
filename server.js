const express = require('express')
const multer  = require('multer');
const path = require('path');
const { exec } = require('child_process');
const cors = require('cors');
const fs = require('fs').promises;
const axios = require('axios');

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../../Desktop'))
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage });
const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());

// Function to execute shell command and handle errors
const { execSync } = require('child_process');

// Function to execute shell command and handle errors
const execCommand = (command) => {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`An error occurred while executing the command: ${error.message}`);
    throw error;
  }
};

// File upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  console.log(req.file);

  try {
    // 1. Compile and deploy the contract
    console.log('Compiling and deploying contract...');
    execCommand('node ./contracts/compileContract.js && node ./contracts/deploy.js');

    // 2. Process the sound
    console.log('Processing sound...');
    execCommand(`node ./src/api/wavToJson.js ${req.file.path}`);
    execCommand('node ./src/api/stringifySoundData.js');
    execCommand('node ./src/api/modifyPitchJson.js');

    // 3. Modify the sound
    console.log('Modifying sound...');
    execCommand(`python3 ./python/modifyOriginalWav.py ${req.file.path}`);

    try {
      // Use path.join and __dirname to get an absolute path to the file
      const filePath = path.join(__dirname, '../NoiseBloc2/public/modSounds/modifiedSound.wav');
      console.log(`Reading file from: ${filePath}`);
      // Use res.download instead of fs.readFile and res.send
      res.download(filePath, 'modifiedSound.wav', function(err){
        if (err) {
          console.error('An error occurred:', err);
          res.status(500).send('An error occurred while processing the sound.');
        } else {
          console.log('File sent successfully');
        }
      });
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).send('An error occurred while processing the sound.');
    }
  } catch (error) { // This closing bracket was missing
    console.error('An error occurred:', error);
    res.status(500).send('An error occurred while processing the sound.');
  }
});
//
//
//app.post('/upload', upload.single('file'), async (req, res) => {
//  console.log(req.file);
//
//  try {
//    // 1. Compile and deploy the contract
//    console.log('Compiling and deploying contract...');
//    await axios.post('http://localhost:3001/compileAndDeploy');
//
//    // 2. Process the sound
//    console.log('Processing sound...');
//    await axios.post('http://localhost:3001/processSound');
//
//    // 3. Modify the sound
//    console.log('Modifying sound...');
//    await axios.post('http://localhost:3001/modifySound');
//
//    // 4. Read the modified sound file and send it as a response
//    const modifiedSound = await fs.readFile('../../../Desktop/modified.wav');
//    res.send(modifiedSound);
//  } catch (error) {
//    console.error('An error occurred:', error);
//    res.status(500).send('An error occurred while processing the sound.');
//  }
//});

// Contract compilation and deployment endpoint
app.post('/compileAndDeploy', (req, res) => {
  execCommand('node compileContract.js && node deploy.js', res);
});

// Sound processing endpoint
app.post('/processSound', (req, res) => {
  execCommand('node wavToJson.js && node stringifySoundData.js && node modifyPitchJson.js', res);
});

// Sound modification endpoint
app.post('/modifySound', (req, res) => {
  execCommand('python modifyOriginalWav.py', res);
});

// Start the server
const listeningServer = 3001;
app.listen(listeningServer, () => {
  console.log('Server listening on port ' + listeningServer);
});
