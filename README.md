# codehub_calendar

This web app will convert your Douglas Syllabus PDF files into Calendar events on the calendar app of your choice (Google or Outlook)

Upload your class syllabus pdf files
The app will grab the relevant dates for each of the courses
You can double check the results, edit the dates, add events
Once it all looks good, we'll send it to Google/Outlook API
This will create the appropriate events in your Calendar!
And you're done!

**[Designs](https://ovenapp.io/view/IWBerLOlcQNbCMxUhMmuyJSDSnYgPvtB/)**

**Technologies:**

HTML
CSS
JavaScript

Python with Flask

## Coding Conventions

Please make sure to add comments to any JS or Python code your write

Allways pull before you push

Before you push to master, make sure your feature is well tested and nothing is broken

Make sure your commits are all commented with meaningful messages
=> The convention for this is to make commits for each main change or feature you make. This keeps the history tidy, and when we look at the files editted, we'll know that these changes were made for this.

When you close a github issue, make sure to add the Commit hash to that issue's closing comment, to keep the history organized

## Development Environment Setup

### Provided you are already having:
    
* [Python3.8+](https://www.python.org/downloads/) and it exist in you environment variable
* [Java](https://www.java.com/en/download/) Runtime Environment

### Steps:

1. Fork the repository and clone it to your working directory
2. Navigate to the root directory in terminal and:
3. Setup the virtual Environment by running:

    ```bash
    Py -m venv venv
    ```

4. Activate the environment file by running:

    ```bash
    venv\Scripts\activateripts\activate.ps1
    ```

    or For Mac user

    ```bash
    source venv/bin/activate
    ```

    `Note: You will notice "(env)" as your path prefix`
5. Now install all the required library by entering command:

    ```bash
    pip install -r requirements.txt
    ```

6. Go to the root folder(where you can see main.py), create a new file called config.py
7. You need to initialize a key values in here:

    ```python
    import os
    class Config(object):
        UPLOAD_FOLDER = '.\\application'
    ```

    or For Mac user

    ```python
    import os
    class Config(object):
        UPLOAD_FOLDER = "./application"
    ```

    `Note: you need to provide a path where you would like to keep pdf for processing`
8. All set! Now you are good to go ahead and run the application by entering command:

    ```bash
    flask run
    ```

9. Once you are done with your work you can deactivate the virtual environment by command:

    ```bash
    deactivate
    ```
