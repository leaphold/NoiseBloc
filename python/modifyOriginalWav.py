import os
import sys
import numpy as np
from scipy.io import wavfile
import json
import hashlib

def load_audio(file_path):
    try:
        sample_rate, data = wavfile.read(file_path)
        return sample_rate, data.astype(float)
    except Exception as e:
        print(f"Error loading audio file: {e}")
        sys.exit(1)

def load_json(json_path):
    try:
        with open(json_path, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading JSON file: {e}")
        sys.exit(1)

def add_pitches(data, sample_rate, modified_pitches, key, volume_scale=150.0):
    samples_per_pitch = int(sample_rate * 5.0)  # 5 seconds per pitch
    added_pitches = np.zeros(samples_per_pitch * len(modified_pitches))
    added_pitches_list = []

    # Convert the key to a hash
    key_hash = hashlib.sha256(key.encode()).hexdigest()
    # Use the hash as a seed to create a random number generator
    rng = np.random.default_rng(int(key_hash, 16))

    for i, window in enumerate(modified_pitches):
        # Use the random number generator to choose a pitch
        pitch = rng.choice(window['pitches'])
        print(f"Added pitch: {pitch}")

        # Generate a sinusoidal wave with the desired pitch
        t = np.arange(samples_per_pitch)
        sinusoid = np.sin(2 * np.pi * pitch * t / sample_rate)

        # Ensure pitch values are scaled appropriately
        added_pitches[i * samples_per_pitch: (i + 1) * samples_per_pitch] = sinusoid * volume_scale

        added_pitches_list.append({"id": i, "pitch": pitch})

    # Trim added_pitches to match the length of data
    if len(added_pitches) > len(data):
        added_pitches = added_pitches[:len(data)]

    return added_pitches, added_pitches_list

def mix_audio(data, added_pitches):
    if data.ndim == 1:
        mixed_data = data[:len(added_pitches)] + added_pitches
    else:
        mixed_data = np.zeros_like(data)
        for channel in range(data.shape[1]):
            mixed_data[:len(added_pitches), channel] = data[:len(added_pitches), channel] + added_pitches
    return np.clip(mixed_data, -32768, 32767)

def save_json(data, file_path):
    try:
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=4)
    except Exception as e:
        print(f"Error saving JSON file: {e}")

def save_audio(data, sample_rate, output_path):
    try:
        wavfile.write(output_path, sample_rate, np.int16(data))
    except Exception as e:
        print(f"Error saving audio file: {e}")

def main():
    if len(sys.argv) < 3:
        print("Usage: python script.py <audio_file_path> <key>")
        sys.exit(1)

    file_path = sys.argv[1]
    key = sys.argv[2]
    json_path = os.path.join(os.path.dirname(__file__), '../data/pitchesMod.json')
    output_dir = os.path.expanduser('/home/leophold/Documents/Code/NoiseBloc3/NoiseBloc/public/')
    output_file = os.path.join(output_dir, 'modifiedsound.wav')

    print(f"Audio file path: {file_path}")
    print(f"JSON file path: {json_path}")
    print(f"Output directory: {output_dir}")
    print(f"Output file: {output_file}")

    if not os.access(output_dir, os.W_OK):
        print(f"No write permissions for directory: {output_dir}")
        sys.exit(1)

    sample_rate, data = load_audio(file_path)
    modified_pitches = load_json(json_path)

    added_pitches, added_pitches_list = add_pitches(data, sample_rate, modified_pitches, key, volume_scale=100.0)  # Increase volume_scale

    save_json(added_pitches_list, 'added_pitches.json')

    mixed_data = mix_audio(data, added_pitches)

    if not os.path.exists(output_dir):
        try:
            os.makedirs(output_dir)
        except Exception as e:
            print(f"Error creating directory: {e}")
            sys.exit(1)

    save_audio(mixed_data, sample_rate, output_file)

if __name__ == '__main__':
    main()
