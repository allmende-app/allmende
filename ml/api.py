import flask
from flask import Flask, request
from scanner import scanImage 
from PIL import Image


app = Flask(__name__)
app.config['Debug'] = True #Only necessary for debugging and developping

@app.route('/')
def index():
    return 'Flask is running'

#Route for sending Image and returning the ML results
@app.route('/scan', methods=['GET'])
def scan():
    file = request.files['image']
    
    #Getting file of request
    img = Image.open(file.stream)
    data = file.stream.read()

    #Calling scanImage() in scanner.py

    try:
        result = scanImage(img)
        return result
    except:
        return flask.Response(response="Something went wrong while scanning the Image", status=500)
