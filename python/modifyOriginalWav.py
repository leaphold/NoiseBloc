import os
import sys
import numpy as np
from scipy.io import wavfile
import json

file_path = sys.argv[1]

# Load the original sound
sample_rate, data = wavfile.read(file_path)

# Ensure the audio data is float
data = data.astype(float)

# Load the modified JSON file
json_path = os.path.join(os.path.dirname(__file__), '../data/pitchesMod.json')
with open(json_path, 'r') as f:
    modified_pitches = json.load(f)

# Calculate how many samples correspond to 3 seconds
samples_per_3_seconds = int(sample_rate * 3)

# Calculate how many samples correspond to 25 milliseconds
samples_per_pitch = int(sample_rate * 0.025)

# Create a new array to hold the added pitches
added_pitches = np.zeros(samples_per_3_seconds * len(modified_pitches))

# Create a new list to hold the added pitches
added_pitches_list = []

# For each window in the modified JSON file...
for i, window in enumerate(modified_pitches):
    # Select a random pitch from the window
    pitch = np.random.choice(window['pitches'])

    # Print the added pitch
    print(f"Added pitch: {pitch}")

    # Add the pitch softly to the original sound every 3 seconds
    added_pitches[i * samples_per_3_seconds : i * samples_per_3_seconds + samples_per_pitch] = pitch * 0.01

    # Add the pitch to the list
    added_pitches_list.append({"id": i, "pitch": pitch})

# Save the added pitch to a JSON file
with open('added_pitches.json', 'w') as f:
    json.dump(added_pitches_list, f)

# Mix the original sound with the added pitches
if data.ndim == 1:
    # Mono audio
    mixed_data = data[:len(added_pitches)] + added_pitches
else:
    # Stereo audio
    mixed_data = np.zeros_like(data)
    for channel in range(data.shape[1]):
        mixed_data[:len(added_pitches), channel] = data[:len(added_pitches), channel] + added_pitches

# Ensure the mixed data does not exceed the int16 range
mixed_data = np.clip(mixed_data, -32768, 32767)

# Convert it to a 16-bit integer array
final_data = np.int16(mixed_data)

# Ensure the directory exists before writing the file
output_dir = os.path.expanduser('~/Documents/Code/NoiseBloc2/public/modSounds/')
os.makedirs(output_dir, exist_ok=True)

output_file = os.path.join(output_dir, 'modifiedSound.wav')
wavfile.write(output_file, sample_rate, final_data)
