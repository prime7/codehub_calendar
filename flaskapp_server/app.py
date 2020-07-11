from flask import Flask
from flask import render_template, request, redirect, url_for
import tabula
from werkzeug.utils import secure_filename
from testCode import getResponse


app = Flask(__name__, template_folder ='templates', static_folder = 'static')

@app.route("/")
def home():
    return render_template('firstPageHTML.html')

@app.route('/server', methods=['GET', 'POST'])
def readPDF():
    if request.method == "POST":
        uploadedFile = request.files["uploadField"]
        uploadedFile.save(secure_filename(uploadedFile.filename))
        #tabula.convert_into(uploadedFile.filename, "output.csv", output_format="csv", pages='all')
        return getResponse(uploadedFile.filename)


   
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
