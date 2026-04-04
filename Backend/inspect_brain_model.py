import tensorflow as tf
import os

model_path = r"c:\Users\Shiva shanker\My Projects\medisense-ai\Medisense-AI\brain_tumor_model.h5"

if os.path.exists(model_path):
    try:
        model = tf.keras.models.load_model(model_path)
        print("Model loaded successfully.")
        print("-" * 20)
        print("Input Shape:", model.input_shape)
        print("Output Shape:", model.output_shape)
        print("-" * 20)
        model.summary()
    except Exception as e:
        print("Error loading model:", e)
else:
    print("Model file not found at:", model_path)
