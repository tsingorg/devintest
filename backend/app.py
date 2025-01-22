from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure SQLite database (in-memory for development)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Database Models
class List(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    remarks = db.Column(db.Text)
    features = db.relationship('Feature', backref='list', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'remarks': self.remarks,
            'features': [feature.to_dict() for feature in self.features]
        }

class Feature(db.Model):
    list_id = db.Column(db.Integer, db.ForeignKey('list.id'), primary_key=True)
    feature_id = db.Column(db.String(50), primary_key=True)
    feature_name = db.Column(db.String(100), nullable=False)
    remarks = db.Column(db.Text)

    def to_dict(self):
        return {
            'list_id': self.list_id,
            'feature_id': self.feature_id,
            'feature_name': self.feature_name,
            'remarks': self.remarks
        }

# Create tables
with app.app_context():
    db.create_all()

# API Routes
@app.route('/api/lists', methods=['GET'])
def get_lists():
    lists = List.query.all()
    return jsonify([list.to_dict() for list in lists])

@app.route('/api/lists/<int:list_id>', methods=['GET'])
def get_list(list_id):
    list = List.query.get_or_404(list_id)
    return jsonify(list.to_dict())

@app.route('/api/lists', methods=['POST'])
def create_list():
    data = request.json
    new_list = List(name=data['name'], remarks=data.get('remarks', ''))
    
    if 'features' in data:
        for feature in data['features']:
            new_feature = Feature(
                feature_id=feature['feature_id'],
                feature_name=feature['feature_name'],
                remarks=feature.get('remarks', '')
            )
            new_list.features.append(new_feature)
    
    db.session.add(new_list)
    db.session.commit()
    return jsonify(new_list.to_dict()), 201

@app.route('/api/lists/<int:list_id>', methods=['PUT'])
def update_list(list_id):
    list = List.query.get_or_404(list_id)
    data = request.json
    
    list.name = data.get('name', list.name)
    list.remarks = data.get('remarks', list.remarks)
    
    db.session.commit()
    return jsonify(list.to_dict())

@app.route('/api/lists/<int:list_id>', methods=['DELETE'])
def delete_list(list_id):
    list = List.query.get_or_404(list_id)
    db.session.delete(list)
    db.session.commit()
    return '', 204

@app.route('/api/lists/<int:list_id>/features', methods=['POST'])
def add_feature(list_id):
    list = List.query.get_or_404(list_id)
    data = request.json
    
    new_feature = Feature(
        list_id=list_id,
        feature_id=data['feature_id'],
        feature_name=data['feature_name'],
        remarks=data.get('remarks', '')
    )
    
    db.session.add(new_feature)
    db.session.commit()
    return jsonify(new_feature.to_dict()), 201

@app.route('/api/lists/<int:list_id>/features/<feature_id>', methods=['PUT'])
def update_feature(list_id, feature_id):
    feature = Feature.query.get_or_404((list_id, feature_id))
    data = request.json
    
    feature.feature_name = data.get('feature_name', feature.feature_name)
    feature.remarks = data.get('remarks', feature.remarks)
    
    db.session.commit()
    return jsonify(feature.to_dict())

@app.route('/api/lists/<int:list_id>/features/<feature_id>', methods=['DELETE'])
def delete_feature(list_id, feature_id):
    feature = Feature.query.get_or_404((list_id, feature_id))
    db.session.delete(feature)
    db.session.commit()
    return '', 204

@app.route('/api/import', methods=['POST'])
def import_list():
    """Import a feature list from a text file."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if not file.filename:
        return jsonify({'error': 'No file selected'}), 400
    
    # Extract list name from filename (remove extension)
    list_name = os.path.splitext(file.filename)[0]
    
    # Create new list
    new_list = List(name=list_name, remarks='Imported from file')
    db.session.add(new_list)
    db.session.flush()  # Get the new list ID
    
    # Read and parse file
    try:
        content = file.read().decode('utf-8')
        for line in content.splitlines():
            line = line.strip()
            if not line:  # Skip empty lines
                continue
            
            parts = line.split(',')
            if len(parts) < 2:  # Skip invalid lines
                continue
            
            feature_id = parts[0].strip()
            feature_name = parts[1].strip()
            
            # Create new feature
            new_feature = Feature(
                list_id=new_list.id,
                feature_id=feature_id,
                feature_name=feature_name,
                remarks=''
            )
            db.session.add(new_feature)
        
        db.session.commit()
        return jsonify(new_list.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
