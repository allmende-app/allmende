import flask
from flask import Flask, request
from scanner import scanImage 

app = Flask(__name__)

@app.route('/')
def index():
    return 'Flask is running'

#Route for sending Image and returning the ML results
@app.route('/scan', methods=['GET'])
def scan():
    try:
        requestData = request.json
        image_url = requestData['image_url']
    except:
        return flask.Response(response="Missing Variables", status=422)

    #Calling scanImage() in scanner.py
    try:
        result = scanImage(image_url)
        return result
    except:
        return flask.Response(response="Something went wrong while scanning the Image", status=500)
