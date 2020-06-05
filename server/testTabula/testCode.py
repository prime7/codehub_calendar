import csv
import tabula
import json

# convert PDF into CSV file
#tabula.convert_into("testInput.pdf", "output.csv", output_format="csv", pages='all')

courseCode = "CSIS 3175"

dictForDatesAndEvent = {}
# refining input
with open('output.csv', newline='') as csvfile:
    fileReader = csv.reader(csvfile, delimiter=',')
    line = 0

    # going through each row
    for row in fileReader:
        print(f'line number : {line}')

        #copyOfRow = row
        # Going through each coloumn in each row
        for colToCheckEvent in row:
            print(colToCheckEvent)

            """
            Direct comparision is made to find out if event is being mentioned.
            Needs to be change to make it dynamic.
            Suggestio - Reg Expression
            """

            # TO DO
            if (colToCheckEvent == "MIDTERM" or ("Project Presentation" in colToCheckEvent)):

                # Since we found a event in current row, hence we will go through it again to find date
                for colToCheckDate in row:

                    # TO DO
                    if (colToCheckDate == "Feb 28" or ("Apr 1" in colToCheckDate)):
                        dictForDatesAndEvent[colToCheckEvent] = colToCheckDate

        line += 1

print(dictForDatesAndEvent)

#result dictionary of events, dates, course name, course code
resultDict = {
    "Course Code": courseCode,
    "Events": dictForDatesAndEvent
}

print(resultDict)

jsonResponse = json.dumps(resultDict)

print(jsonResponse)
