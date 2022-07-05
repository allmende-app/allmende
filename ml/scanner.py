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
    
    if kingdom == 'bird' or kingdom  ==  'plantae' or kingdom == 'insect':
        lastElementIndex = len(prediction[0])-1
        prediction = prediction[:,:lastElementIndex]
    
    sorted_index_array = np.argsort(prediction[0])

    # Change values to adapt output
    maxResults = 5
    minPercent = 10

    result = sorted_index_array[-maxResults : ]
    
    # Create JSON
    data_set = {
        "class1": int(classnames[result[maxResults-1]]),
        "probability1": round(prediction[0][result[maxResults-1]] * 100, 2),
    }

    j = 2

    for i in reversed(range(maxResults-1)):
        if prediction[0][result[i]] * 100 > minPercent:
            data_set['class' + str(j)] = int(classnames[result[i]])
            data_set['probability' + str(j)] = round(prediction[0][result[i]] * 100, 2)
            j+=1
        else:
            break

    json_dump = json.dumps(data_set)
    json_object = json.loads(json_dump)

    return json_object
