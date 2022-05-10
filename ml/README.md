# allmende ML
## Setup

1.  If not already installed, download and install the newest Python version via https://www.python.org/ or install it via the terminal commands: <br/>
`sudo apt update` <br/>
`sudo apt install python3` 

2.  Then create a new python environment in the 'ML' folder <br />
    `cd allmende/ml` <br/>
    `python3 -m venv venv`

3.  Activate the environment: <br/>
`. venv/bin/activate`

4. And install flask and other packages via pip:<br/>
`pip install flask` <br/>
`pip install tensorflow` <br/>
`pip install torch`

**Important:** If you get error messages for the imports in the code,check that you activate your created environment. Please check or google how to do it with your prefered IDE. (Or ask Stefan)

## Starting flask and the api
Use terminal again:

1. `export FLASK_APP=api.py`

2. If you want to develop and debug: <br/>
`FLASK_ENV=Development`
3. `flask run`
4. The api should start on http://127.0.0.1:5000/ 

Use Programs like Postman for debugging and testing


