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
    img_size = 224 #Muss je nach Model angepasst werden
    image_resized = cv2.resize(open_cv_image, (img_size, img_size))
    image_prediction = np.expand_dims(image_resized, axis=0)


    # Load Model and Name List
    export_path = os.path.join(os.getcwd()) + '/saved_model/' + kingdom
    loaded_model = tf.keras.models.load_model(export_path)
    classnames = np.load(export_path + '/classnames.npy')

    # Image recognition
    prediction = loaded_model.predict(image_prediction)
    score = tf.nn.softmax(prediction[0])

    class1 = classnames[np.argmax(score)]
    propability1 = round(100 * np.max(score), 2)
    classnames = np.delete(classnames, np.argmax(score))
    score = np.delete(score, np.argmax(score))
    class2 = classnames[np.argmax(score)]
    propability2 = round(100 * np.max(score), 2)
    classnames = np.delete(classnames, np.argmax(score))
    score = np.delete(score, np.argmax(score))
    class3 = classnames[np.argmax(score)]
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
