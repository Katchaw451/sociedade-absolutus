from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit
import numpy as np
import matplotlib.pyplot as plt
import base64
from io import BytesIO
import time
import threading
import random

app = Flask(__name__)
app.config['SECRET_KEY'] = 'absolutus_secret'
socketio = SocketIO(app, cors_allowed_origins="*")

class PredictionEngine:
    def __init__(self):
        self.user_inputs = []
        self.global_predictions = {}
        
    def generate_sequence(self, prompt):
        sequences = []
        
        for i in range(10):
            img_data = self._create_prediction_frame(prompt, i)
            sequences.append({
                'frame': i + 1,
                'image': img_data,
                'reaction_type': self._get_reaction_type(prompt, i),
                'intensity': np.random.normal(0.5, 0.2)
            })
            
        stats = self._calculate_statistics(sequences)
        
        return {
            'sequences': sequences,
            'statistics': stats,
            'timestamp': time.time()
        }
    
    def _create_prediction_frame(self, prompt, frame_index):
        plt.figure(figsize=(4, 3))
        
        if 'stress' in prompt.lower():
            data = self._simulate_stress_response(frame_index)
        elif 'cognitive' in prompt.lower():
            data = self._simulate_cognitive_load(frame_index)
        else:
            data = self._simulate_general_reaction(frame_index)
        
        plt.plot(data, color='#00ff88', linewidth=2)
        plt.fill_between(range(len(data)), data, alpha=0.3, color='#00ff88')
        plt.title(f'Frame {frame_index + 1}')
        plt.axis('off')
        
        buffer = BytesIO()
        plt.savefig(buffer, format='png', transparent=True, dpi=100, bbox_inches='tight')
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.getvalue()).decode()
        plt.close()
        
        return f"data:image/png;base64,{image_base64}"
    
    def _simulate_stress_response(self, frame_index):
        x = np.linspace(0, 4*np.pi, 50)
        return np.sin(x + frame_index * 0.5) * np.exp(-0.1 * x) + np.random.normal(0, 0.1, 50)
    
    def _simulate_cognitive_load(self, frame_index):
        x = np.linspace(0, 10, 50)
        return np.cumsum(np.random.normal(0, 0.2, 50)) + np.sin(x + frame_index)
    
    def _simulate_general_reaction(self, frame_index):
        t = np.linspace(0, 10, 50)
        return (np.sin(t + frame_index) + 
                0.5 * np.sin(2*t + frame_index) + 
                0.3 * np.random.normal(0, 1, 50))
    
    def _get_reaction_type(self, prompt, frame_index):
        reactions = [
            'Neural Activation', 'Cortisol Response', 'Cognitive Load',
            'Emotional Arousal', 'Physiological Shift', 'Behavioral Change',
            'Metabolic Rate', 'Sensory Processing', 'Motor Response',
            'Homeostatic Adjustment'
        ]
        return reactions[frame_index % len(reactions)]
    
    def _calculate_statistics(self, sequences):
        intensities = [seq['intensity'] for seq in sequences]
        r_squared = max(0, min(1, 0.7 + np.random.normal(0, 0.1)))
        p_value = max(0.001, min(0.1, np.random.normal(0.03, 0.02)))
        
        return {
            'r_squared': round(r_squared, 3),
            'p_value': round(p_value, 4),
            'confidence': int(r_squared * 100),
            'trend_direction': 'positive' if np.mean(intensities) > 0.5 else 'negative'
        }

class MiningSimulator:
    def __init__(self):
        self.mining_active = False
        
    def simulate_mining(self):
        progress = 0
        while progress < 100:
            progress += random.uniform(0.5, 3.0)
            if progress > 100:
                progress = 100
            yield progress
            time.sleep(1)

prediction_engine = PredictionEngine()
mining_simulator = MiningSimulator()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_prediction', methods=['POST'])
def generate_prediction():
    data = request.json
    prompt = data.get('prompt', '')
    results = prediction_engine.generate_sequence(prompt)
    return jsonify(results)

@socketio.on('start_mining')
def handle_start_mining():
    def mining_thread():
        for progress in mining_simulator.simulate_mining():
            socketio.emit('mining_update', {
                'progress': round(progress, 2),
                'insights_mined': int(progress * 10)
            })
            if progress >= 100:
                break
            time.sleep(1)
    
    thread = threading.Thread(target=mining_thread)
    thread.daemon = True
    thread.start()

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
