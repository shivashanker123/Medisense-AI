import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.applications.efficientnet import preprocess_input
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam

# ======================
# CONFIG
# ======================
IMG_SIZE = 224
BATCH_SIZE = 16     # safer for CPU
EPOCHS = 20

# ======================
# DATA PATHS
# ======================
train_dir = r"C:\tensorflow model\archive (1)\Training"
test_dir  = r"C:\tensorflow model\archive (1)\Testing"

# ======================
# DATA GENERATORS
# ======================
train_gen = ImageDataGenerator(
    preprocessing_function=preprocess_input,
    rotation_range=15,
    zoom_range=0.2,
    horizontal_flip=True
)

test_gen = ImageDataGenerator(
    preprocessing_function=preprocess_input
)

train_data = train_gen.flow_from_directory(
    train_dir,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode="categorical"
)

test_data = test_gen.flow_from_directory(
    test_dir,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode="categorical"
)

# ======================
# MODEL
# ======================
base_model = EfficientNetB0(
    weights="imagenet",
    include_top=False,
    input_shape=(IMG_SIZE, IMG_SIZE, 3)
)

base_model.trainable = False

x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(256, activation="relu")(x)
x = Dropout(0.5)(x)
output = Dense(4, activation="softmax")(x)

model = Model(inputs=base_model.input, outputs=output)

# ======================
# COMPILE
# ======================
model.compile(
    optimizer=Adam(learning_rate=1e-4),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

# ======================
# TRAIN
# ======================
model.fit(
    train_data,
    validation_data=test_data,
    epochs=EPOCHS
)

# ======================
# SAVE MODEL
# ======================
model.save("brain_tumor_model.h5")

print("✅ Model training complete and saved as brain_tumor_model.h5")
