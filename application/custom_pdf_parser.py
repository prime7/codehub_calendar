import csv
import tabula
import json
import re
import os
from application import app

def parsing_results(filename):

    # convert PDF into CSV file
    outputname = (filename.split("."))[0] + "_output.csv"
    tabula.convert_into(os.path.join(app.config['UPLOAD_FOLDER'],filename),os.path.join(app.config['UPLOAD_FOLDER'],outputname) , output_format="csv", pages='all')

    courseCode = ""

    coursePattern = re.compile(r"\b(CSIS) [0-9]{4}\b", flags=re.IGNORECASE)

    datePattern = re.compile(
        r"(\b[0-9]{1,2} Mar)|((Jan|Feb|Mar|Apr|May|June|July|Aug) [0-9]{1,2}\b)", flags=re.IGNORECASE)

    eventPattern = re.compile(
        r"(Quiz|Assignment|midterm|final|Project|presentation)", flags=re.IGNORECASE)

    dictForDatesAndEvent = {}
    # refining input
    with open(os.path.join(app.config['UPLOAD_FOLDER'],outputname), newline='') as csvfile:
        fileReader = csv.reader(csvfile, delimiter=',')

        # going through each row
        for row in fileReader:

            # Going through each coloumn in each row
            for colToCheckEvent in row:

                # checking for course number as well
                if(courseCode == ""):
                    course = coursePattern.search(colToCheckEvent)
                    if(course is not None):
                        courseCode = course.group()

                event = eventPattern.search(colToCheckEvent)

                if (event is not None):

                    # Since we found a event in current row, hence we will go through it again to find date
                    for colToCheckDate in row:

                        date = datePattern.search(colToCheckDate)
                        # TO DO
                        if (date is not None):
                            dictForDatesAndEvent[event.group()] = date.group()

    # result dictionary of events, dates, course name, course code
    resultDict = {
        "Course Code": courseCode,
        "EventsAndDates": dictForDatesAndEvent
    }

    jsonResponse = json.dumps(resultDict)
    os.remove(os.path.join(app.config['UPLOAD_FOLDER'],filename))
    os.remove(os.path.join(app.config['UPLOAD_FOLDER'],outputname))
    return jsonResponse
