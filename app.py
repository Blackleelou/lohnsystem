
from flask import Flask, render_template, redirect, url_for, request, session
app = Flask(__name__)
app.secret_key = 'supersecret'

@app.route('/')
def home():
    if 'user' in session:
        return render_template('dashboard.html', user=session['user'])
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        session['user'] = request.form['email']
        return redirect(url_for('home'))
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('home'))

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
