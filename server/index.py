
from flask import Flask, request, jsonify, send_from_directory
import os
from datetime import datetime

app = Flask(__name__)

# In-memory storage
users = {}
messages = []
user_id_counter = 1
message_id_counter = 1

@app.route('/api/messages', methods=['GET'])
def get_messages():
    return jsonify(messages)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    global message_id_counter
    
    # Save user message
    user_message = {
        'id': message_id_counter,
        'content': data['content'],
        'role': 'user',
        'username': data['username'],
        'timestamp': datetime.now().isoformat()
    }
    message_id_counter += 1
    messages.append(user_message)
    
    # AI response simulation
    ai_message = {
        'id': message_id_counter,
        'content': f"CYON AI response to: {data['content']}",
        'role': 'assistant',
        'username': data['username'],
        'timestamp': datetime.now().isoformat()
    }
    message_id_counter += 1
    messages.append(ai_message)
    
    return jsonify({
        'userMessage': user_message,
        'aiMessage': ai_message
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
