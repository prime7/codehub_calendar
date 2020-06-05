import csv
import tabula
import json
import re

# convert PDF into CSV file
#tabula.convert_into("testInput.pdf", "output.csv", output_format="csv", pages='all')

courseCode = ""

coursePattern = re.compile(r"\b(CSIS) [0-9]{4}\b", flags=re.IGNORECASE)

datePattern = re.compile(
    r"(\b[0-9]{1,2} Mar)|((Jan|Feb|Mar|Apr|May|June|July|Aug) [0-9]{1,2}\b)", flags=re.IGNORECASE)

eventPattern = re.compile(
    r"(Quiz|Assignment|midterm|final|Project|presentation)", flags=re.IGNORECASE)

dictForDatesAndEvent = {}
# refining input
with open('output.csv', newline='') as csvfile:
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

print(jsonResponse)
