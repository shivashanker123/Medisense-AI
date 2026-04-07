import tensorflow as tf
import os
import json

model_path = r"c:\Users\Shiva shanker\My Projects\medisense-ai\Medisense-AI\brain_tumor_model.h5"

try:
    model = tf.keras.models.load_model(model_path)
    print("SUCCESS")
    print(f"INPUT_SHAPE: {model.input_shape}")
    print(f"OUTPUT_SHAPE: {model.output_shape}")
    
    # Try to find class names in metadata or layer config
    config = model.get_config()
    # print(json.dumps(config, indent=2))
except Exception as e:
    print(f"FAILURE: {e}")
