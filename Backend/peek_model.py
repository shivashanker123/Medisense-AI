import h5py
import json

model_path = r"c:\Users\Shiva shanker\My Projects\medisense-ai\Medisense-AI\brain_tumor_model.h5"

try:
    with h5py.File(model_path, 'r') as f:
        # Keras encodes the model configuration as an attribute
        if 'model_config' in f.attrs:
            config = f.attrs['model_config']
            # Decode if it's bytes
            if isinstance(config, bytes):
                config = config.decode('utf-8')
            
            # The config is typically a JSON string
            model_data = json.loads(config)
            
            # Usually the first layer's batch_input_shape describes the input
            layers = model_data.get('config', {}).get('layers', [])
            if layers:
                first_layer = layers[0]
                input_shape = first_layer.get('config', {}).get('batch_input_shape')
                print(f"Detected Input Shape: {input_shape}")
            
            # Check for class names or output layers
            print("Model configuration loaded.")
        else:
            print("Could not find 'model_config' in the H5 file metadata.")
            # Print keys in the file to see structure
            print("File Keys:", list(f.keys()))
except Exception as e:
    print(f"Error reading with h5py: {e}")
