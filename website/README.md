## Sample server using Django

- Install virtualenv
- activate it
- pip install -r requirements.txt

- python manage.py migrate
- python manage.py runserver



- This is a simple django server setup where in the root url it will ask user to input a pdf
- user will upload it and submit - then do whatever you want to do with that pdf.
- Look for the urls.py, views.py in apps folder.

- Suggestions
- in the apps section make a model -> whatever fields(think of it as database cells) you need.
- Suppose for us we may need exam dates. So our model will have a exam date.
- Then in the views section parse the pdf, don't need to convert it to csv. Grab the values - in our case exam dates. Then map it with    model and save. In the same function - when user is giving a POST request with pdf file, you have two option to sync with google calender. In the same function or user will have a sync button, by pressing that you will call a new function to sync it. 