import tensorflow as tf
import os
import cv2
import numpy as np
import json

from PIL import Image
from tokenize import String
from tensorflow import keras

def scanImage(image: Image, kingdom: String):
    open_cv_image = np.array(image) 
    # Convert RGB to BGR 
    open_cv_image = open_cv_image[:, :, ::-1].copy() 

    # Prepare Image
    IMAGE_SHAPE = (224, 224) #Muss je nach Model angepasst werden
    image_resized = image.resize(IMAGE_SHAPE)
    # Normalize Image
    image_prediction = np.array(image_resized)/255.0

    # Load Model and Name List
    export_path = os.path.join(os.getcwd()) + '/saved_model/' + kingdom
    loaded_model = tf.keras.models.load_model(export_path)
    classnames = np.load(export_path + '/classnames.npy')

    # Image recognition
    prediction = loaded_model.predict(image_prediction[np.newaxis, ...])
    sorted_index_array = np.argsort(prediction[0])

    n = 5
    result = sorted_index_array[-n : ]
    
    # Create JSON
    data_set = {
        "class1": str(classnames[result[4]]),
        "probability1": round(prediction[0][result[4]] * 100, 2),
        "class2": str(classnames[result[3]]),
        "probability2": round(prediction[0][result[3]] * 100, 2),
        "class3": str(classnames[result[2]]),
        "probability3": round(prediction[0][result[2]] * 100, 2),
        "class4": str(classnames[result[1]]),
        "probability4": round(prediction[0][result[1]] * 100, 2),
        "class5": str(classnames[result[0]]),
        "probability5": round(prediction[0][result[0]] * 100, 2)
    }
    json_dump = json.dumps(data_set)
    json_object = json.loads(json_dump)

    return json_object
