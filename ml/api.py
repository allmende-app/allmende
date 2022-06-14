from ctypes.wintypes import RGB
import flask
from flask import Flask, request
from io import BytesIO
from PIL import Image
from scanner import scanImage 

app = Flask(__name__)

@app.route('/')
def index():
    return 'Flask is running'

#Route for sending Image and returning the ML results
@app.route('/scan', methods=['POST'])
def scan():
    try:
        file = request.files['file']
        kingdom = request.form['kingdom']

        if kingdom != 'plantae' and kingdom != "animalia" and kingdom != 'fungi':
            return flask.Response(response="Kingdom param not supported", status=422)

        image = Image.open(file).convert('RGB')
    except:
        return flask.Response(response="Wrong Input", status=422)

    #Calling scanImage() in scanner.py
    try:
        result = scanImage(image, kingdom)
        return result
    except:
        return flask.Response(response="Something went wrong while scanning the Image", status=500)
