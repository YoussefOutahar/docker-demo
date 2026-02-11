from flask import Flask, jsonify
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def hello():
    return jsonify({
        'message': 'Hello from Flask',
        'framework': 'Python Flask',
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
