import os
import sys
import numpy as np
from scipy.io import wavfile
import json

file_path = sys.argv[1]

# Load the original sound
sample_rate, data = wavfile.read(file_path)

# Load the modified JSON file
with open(os.path.expanduser('~/Documents/Code/NoiseBloc2/data/pitchesMod.json'), 'r') as f:
    modified_pitches = json.load(f)

# Calculate how many samples correspond to 3 seconds
samples_per_3_seconds = int(sample_rate * 3)

# Calculate how many samples correspond to 25 milliseconds
samples_per_pitch = int(sample_rate * 0.025)

# Create a new array to hold the added pitches
added_pitches = np.zeros(samples_per_3_seconds * len(modified_pitches))

# For each window in the modified JSON file...
for i, window in enumerate(modified_pitches):
    # Select a random pitch from the window
    pitch = np.random.choice(window['pitches'])

    # Print the added pitch
    print(f"Added pitch: {pitch}")

    # Add the pitch softly to the original sound every 3 seconds
    added_pitches[i * samples_per_3_seconds : i * samples_per_3_seconds + samples_per_pitch] = pitch * 0.01

# Ensure the original sound data is a float
data = data.astype(float)

# Mix the original sound with the added pitches for each channel separately
mixed_data = np.zeros_like(data)
for channel in range(data.shape[1]):
    mixed_data[:len(added_pitches), channel] = data[:len(added_pitches), channel] + added_pitches

# Convert it to a 16-bit integer array
final_data = np.int16(mixed_data)

# Ensure the directory exists before writing the file
output_dir = os.path.expanduser('~/Documents/Code/NoiseBloc2/public/modSounds/')
os.makedirs(output_dir, exist_ok=True)

output_file = os.path.join(output_dir, 'modifiedSound.wav')
wavfile.write(output_file, sample_rate, final_data)
