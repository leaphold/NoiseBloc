const express = require('express');
const multer = require('multer');
const path = require('path');
const { execSync } = require('child_process');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(__dirname, 'uploads');
    fs.mkdirSync(uploadsDir, { recursive: true });
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

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
  const filePath = req.file.path;
  const modifiedFilePath = path.join(__dirname, 'public', 'modifiedsound.wav');
  const key = req.body.key; // Get the key from the request body

  try {
    // 1. Compile and deploy the contract
    console.log('Compiling and deploying contract...');
    execCommand('node ./contracts/compileContract.js && node ./contracts/deploy.js');

    // 2. Process the sound
    console.log('Processing sound...');
    execCommand(`node ./src/api/wavToJson.js "${filePath}"`);
    execCommand('node ./src/api/stringifySoundData.js');
    execCommand('node ./src/api/modifyPitchJson.js');

    // 3. Modify the sound
    console.log('Modifying sound...');
    execCommand(`python3 ./python/modifyOriginalWav.py "${filePath}" "${key}"`); // Pass the key as an argument

    // Ensure the modified sound file exists before sending it back
    if (fs.existsSync(modifiedFilePath)) {
      console.log(`Sending file back to user: ${modifiedFilePath}`);
      res.download(modifiedFilePath, 'modifiedSound.wav', (err) => {
        if (err) {
          console.error('An error occurred while sending the file:', err);
          res.status(500).send('An error occurred while processing the sound.');
        } else {
          console.log('File sent successfully');
        }
      });
    } else {
      console.error('Modified file does not exist.');
      res.status(500).send('Modified file does not exist.');
    }
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('An error occurred while processing the sound.');
  }
});

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

app.get('/pitches', (req, res) => {
  const pitchesPath = path.join(__dirname, './added_pitches.json');
  if (fs.existsSync(pitchesPath)) {
    const pitches = JSON.parse(fs.readFileSync(pitchesPath, 'utf-8'));
    res.json(pitches);
  } else {
    res.status(404).send('Pitches not found');
  }
});

app.get('/mark', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3001/clear_pitches');
    if (response.status === 200) {
      res.send('Marked and pitches cleared');
    } else {
      res.status(500).send('An error occurred while marking and clearing the pitches.');
    }
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('An error occurred while marking and clearing the pitches.');
  }
});

// Clear the added pitches when page loads
app.get('/clear_pitches', (req, res) => {
  try {
    fs.writeFileSync(path.join(__dirname, './added_pitches.json'), '[]');
    res.send('Pitches cleared');
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while clearing the pitches.');
  }
});

// Start the server
const listeningServer = 3001;
app.listen(listeningServer, () => {
  console.log('Server listening on port ' + listeningServer);
});
