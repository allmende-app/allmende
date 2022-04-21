import sys
import os

file = sys.argv[1]

def predict(file: str):
    uploads = 'uploads'
    full_path = '{}/{}/{}'.format(os.getcwd(), uploads, file)
    print(full_path)
    # sys.stdout.flush()

predict(file)