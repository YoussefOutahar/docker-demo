from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
# Enable CORS for all routes - allows React app to call this API
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/')
def hello():
    return jsonify({
        'message': 'Hello from Flask',
        'framework': 'Python Flask',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/data')
def get_data():
    """API endpoint that returns data for the React frontend"""
    return jsonify({
        'success': True,
        'message': 'Data from Flask API',
        'framework': 'Python Flask',
        'container': 'python-flask-demo',
        'timestamp': datetime.now().isoformat(),
        'data': {
            'items': [
                {'id': 1, 'name': 'Docker', 'type': 'Container Platform'},
                {'id': 2, 'name': 'Flask', 'type': 'Python Framework'},
                {'id': 3, 'name': 'React', 'type': 'JavaScript Library'}
            ]
        }
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=False)
