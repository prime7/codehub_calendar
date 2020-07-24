from application import app
from config import Config
from flask import render_template, request, redirect, url_for
from werkzeug.utils import secure_filename
from application import custom_pdf_parser
import os
#parsing_results

@app.route("/")
@app.route("/home")
def index():
    return render_template("index.html")


@app.route("/server", methods=['GET', 'POST'])
def parsing_response():
    if request.method == "POST":
        uploadedFile = request.files["uploadField"]
        ufilename = secure_filename(uploadedFile.filename)
        uploadedFile.save(os.path.join(app.config['UPLOAD_FOLDER'], ufilename))
        return custom_pdf_parser.parsing_results(ufilename)