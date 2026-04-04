import h5py
import json

model_path = r"c:\Users\Shiva shanker\My Projects\medisense-ai\Medisense-AI\brain_tumor_model.h5"

try:
    with h5py.File(model_path, 'r') as f:
        if 'model_config' in f.attrs:
            config = f.attrs['model_config']
            if isinstance(config, bytes):
                config = config.decode('utf-8')
            
            model_data = json.loads(config)
            layers = model_data.get('config', {}).get('layers', [])
            if layers:
                last_layer = layers[-1]
                output_units = last_layer.get('config', {}).get('units')
                activation = last_layer.get('config', {}).get('activation')
                print(f"Output Layer: {output_units} neurons, Activation: {activation}")
except Exception as e:
    print(f"Error: {e}")
