#!/usr/bin/env python3
"""
Simple Flask server that works immediately - NO CORS ISSUES
Run: python simple-server.py
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import sqlite3
import hashlib
import os

app = Flask(__name__)
CORS(app, origins="*", allow_headers="*", methods="*")

# Simple in-memory database
DB_FILE = 'users.db'

def init_db():
    conn = sqlite3.connect(DB_FILE)
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'student'
        )
    ''')
    conn.commit()
    conn.close()

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@app.route('/')
def health():
    return jsonify({
        'status': 'Simple server running',
        'message': 'No CORS issues here!',
        'endpoints': ['/api/auth/register', '/api/auth/login', '/api/auth/me']
    })

@app.route('/api/auth/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json()
        name = data.get('name', '')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'student')
        
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute('SELECT id FROM users WHERE email = ?', (email,))
        if cursor.fetchone():
            conn.close()
            return jsonify({'error': 'Email already exists'}), 400
        
        # Create user
        hashed_password = hash_password(password)
        cursor.execute(
            'INSERT INTO users (email, name, password, role) VALUES (?, ?, ?, ?)',
            (email, name, hashed_password, role)
        )
        user_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'user': {
                'id': user_id,
                'username': email,
                'email': email,
                'name': name,
                'role': role
            },
            'token': f'token-{user_id}'
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        # Find user
        hashed_password = hash_password(password)
        cursor.execute(
            'SELECT id, name, role FROM users WHERE email = ? AND password = ?',
            (email, hashed_password)
        )
        user = cursor.fetchone()
        conn.close()
        
        if user:
            return jsonify({
                'success': True,
                'user': {
                    'id': user[0],
                    'username': email,
                    'email': email,
                    'name': user[1],
                    'role': user[2]
                },
                'token': f'token-{user[0]}'
            })
        else:
            return jsonify({'error': 'Invalid credentials'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/me', methods=['GET', 'OPTIONS'])
def me():
    if request.method == 'OPTIONS':
        return '', 200
    
    return jsonify({
        'id': 1,
        'username': 'demo@example.com',
        'email': 'demo@example.com',
        'name': 'Demo User',
        'role': 'student'
    })

if __name__ == '__main__':
    init_db()
    print("🚀 Simple server starting...")
    print("📡 No CORS issues!")
    print("🌐 Update your frontend VITE_API_URL to: http://localhost:5000/api")
    app.run(host='0.0.0.0', port=5000, debug=True)