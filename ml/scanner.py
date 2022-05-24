import tensorflow as tf
import os
import cv2
import numpy as np
import json

from tokenize import String
from tensorflow import keras

def scanImage(url: String):
    export_path = os.path.join(os.getcwd()) + "/saved_model"
    img_size = 180 #Muss je nach Model angepasst werden

    #Load Model and Image
    loaded_model = tf.keras.models.load_model(export_path)
    
    image = cv2.imread(tf.keras.utils.get_file(origin=url))
    image_resized = cv2.resize(image, (img_size, img_size))
    image = np.expand_dims(image_resized,axis=0)

    #Image recognition
    prediction = loaded_model.predict(image)
    class_names = ['daisy', 'dandelion', 'roses', 'sunflowers', 'tulips']
    score = tf.nn.softmax(prediction[0])

    class1 = class_names[np.argmax(score)]
    propability1 = round(100 * np.max(score), 2)
    class_names = np.delete(class_names, np.argmax(score))
    score = np.delete(score, np.argmax(score))
    class2 = class_names[np.argmax(score)]
    propability2 = round(100 * np.max(score), 2)
    class_names = np.delete(class_names, np.argmax(score))
    score = np.delete(score, np.argmax(score))
    class3 = class_names[np.argmax(score)]
    propability3 = round(100 * np.max(score), 2)
    
    #Create json
    data_set = {
        "class1": class1, 
        "propability1": propability1,
        "class2": class2,
        "propability2": propability2,
        "class3": class3,
        "propability3": propability3 
    }
    json_dump = json.dumps(data_set)
    json_object = json.loads(json_dump)

    return json_object