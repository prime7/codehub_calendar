from flask import Flask
from flask import render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("firstPageHTML.html")
    
    
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
