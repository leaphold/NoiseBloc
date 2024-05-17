// wavToJson.js
const fs = require('fs');
const path = require('path'); // Add this line to import the 'path' module
const wav = require('node-wav');
const pitchfinder = require('pitchfinder');

// Create a pitch detector
const detectPitch = pitchfinder.YIN();

// Function to read a WAV file and decode it
function readWavFile(filePath) {
  const buffer = fs.readFileSync(filePath);
  return wav.decode(buffer); // Decode the WAV file into an audio data object
}

// Function to detect pitches in the audio data
function detectPitches(result, windowSize) {
  const float32Array = Float32Array.from(result.channelData[0]); // Convert the audio data to a Float32Array
  const pitches = [];

  // Loop over the audio data in chunks of size windowSize
  for (let i = 0; i < float32Array.length; i += windowSize) {
    const window = float32Array.slice(i, i + windowSize); // Get a window of audio data
    const pitch = detectPitch(window); // Detect the pitch of the window
    pitches.push(pitch); // Add the detected pitch to the pitches array
  }

  return pitches;
}

// Function to get the top 16 pitches every 5 seconds
function getTopPitchesEvery5Seconds(pitches, sampleRate, windowSize) {
  const pitchesEvery5Seconds = [];

  // Loop over the pitches array in chunks of size sampleRate * 5 / windowSize
  for (let i = 0; i < pitches.length; i += Math.floor(sampleRate * 5 / windowSize)) {
    const slice = pitches.slice(i, i + Math.floor(sampleRate * 5 / windowSize)); // Get a slice of pitches
    slice.sort((a, b) => b - a); // Sort the slice in descending order
    const top16 = slice.slice(0, 16); // Get the top 16 pitches
    pitchesEvery5Seconds.push({ id: i / (sampleRate * 5 / windowSize), pitches: top16 }); // Add the top 16 pitches to the pitchesEvery5Seconds array
  }

  return pitchesEvery5Seconds;
}

// Function to write the pitches to a JSON file
function writePitchesToFile(pitches) {
  const filePath = path.join(__dirname, '../../data/pitches.json'); // Use __dirname to get the directory of the current module
  fs.writeFileSync(filePath, JSON.stringify(pitches, null, 2)); // Write the pitches to a JSON file with indentation
}

// Get the path of the WAV file from the command line arguments
const filePath = process.argv[2];

// Use the functions
const result = readWavFile(filePath); // Read the WAV file
const windowSize = Math.floor(result.sampleRate * 0.05); // Set the window size to 25ms
const pitches = detectPitches(result, windowSize); // Detect the pitches in the audio data
const pitchesEvery5Seconds = getTopPitchesEvery5Seconds(pitches, result.sampleRate, windowSize); // Get the top 16 pitches every 5 seconds
writePitchesToFile(pitchesEvery5Seconds); // Write the pitches to a JSON file
