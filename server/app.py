from flask import Flask
from flask_cors import CORS
from tasks import start_tasks
from controller import api

start_tasks()

app = Flask(__name__)
CORS(app)
app.register_blueprint(api)

if __name__ == "__main__":
    start_tasks()
    app.run()
