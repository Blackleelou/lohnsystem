
from flask import Flask, render_template, request, redirect, url_for, session
app = Flask(__name__)
app.secret_key = 'supersecret'

users = {}

@app.route('/')
def index():
    if 'user' in session:
        return render_template('dashboard.html', user=session['user'])
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username_or_email']
        password = request.form['password']
        for u, v in users.items():
            if (username == u or username == v['email']) and password == v['password']:
                session['user'] = u
                return redirect(url_for('index'))
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        if username not in users:
            users[username] = {
                'email': request.form['email'],
                'password': request.form['password'],
                'language': request.form['language'],
                'state': request.form['state'],
                'insurance': request.form['insurance']
            }
            return redirect(url_for('login'))
    return render_template('register.html')

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('index'))

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
