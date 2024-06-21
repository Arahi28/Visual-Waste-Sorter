from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
from io import BytesIO
from google.cloud import firestore
import os
import uvicorn
from PIL import Image
import logging
from datetime import datetime

app = FastAPI()

class_names = [
    'battery', 'cardboard', 'glass', 'medis', 'metal', 
    'organic', 'paper', 'plastic', 'shoes', 'textile', 'vegetation'
]

# Muat model
model = tf.keras.models.load_model('model.h5')

# Set up Google Application Credentials
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/secrets/serviceAccount.json"

# Setup logging
logging.basicConfig(level=logging.INFO)

def predict_image(img_array):
    predictions = model.predict(img_array)
    logging.info(f"Raw predictions: {predictions}")
    score = tf.nn.softmax(predictions[0])
    logging.info(f"Softmax score: {score}")
    return {
        "class": class_names[np.argmax(score)],
        "confidence": float(100 * np.max(score))
    }

def store_data_in_firestore(data):
    try:
        db = firestore.Client()
        db.collection('predictions').add(data)
        logging.info(f"Data stored in Firestore: {data}")
    except Exception as e:
        logging.error(f"Error storing data in Firestore: {e}")

@app.post("/predict")
async def predict(file: UploadFile = File(...), userId: str = Form(...)):
    try:
        # Muat gambar
        img = Image.open(BytesIO(await file.read())).convert('L')  # Konversi ke grayscale
        img = img.resize((100, 100))  # Sesuaikan ukuran gambar dengan ukuran yang digunakan saat pelatihan

        # Praproses gambar
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=-1)  # Tambahkan dimensi saluran (1 saluran)
        img_array = np.expand_dims(img_array, axis=0)  # Tambahkan dimensi batch
        img_array = img_array / 255.0  # Normalisasi

        # Prediksi gambar
        predictions = predict_image(img_array)

        created_at = datetime.now().isoformat()
        predictions['userId'] = userId
        predictions['created_at'] = created_at


        # Simpan hasil prediksi ke Firestore
        store_data_in_firestore(predictions)

        return JSONResponse(content={"predictions": predictions}, status_code=200)

    except Exception as e:
        logging.error(f"Error during prediction: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8080)


