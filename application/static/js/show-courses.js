window.onload = function() {
    document.querySelector('#file-upload').addEventListener('change', handleFileSelect, false);  
}

var courseList = [];

/* SLIDE 1 STUFF  */
function handleFileSelect(e) {
    var selDiv = document.querySelector("#selectedFiles");

    if (!e.target.files) return;

    var files = e.target.files;
    for (var i = 0; i < files.length; i++) {
        var f = files[i];

        selDiv.innerHTML += f.name + "<br/>";

    }

    document.querySelector("#submitFile").disabled = false;
}

function checkFiles() {
    var filePath = document.getElementById('file-upload').value;
    var hasErrors = false;
    var errors = [];

    // Here also we can check PDF extention
    if (filePath) {

        var uploadedFiles = document.getElementById('file-upload');

        for (var i = 0; i < uploadedFiles.files.length; i++) {

            console.log(Math.round(uploadedFiles.files[i].size/1024));
            var ext = uploadedFiles.files[i].name.substr(-3);

            if (ext!== "pdf")  {

                errors.push("Sorry, file with this extension can't be uploaded");
                hasErrors = true;
                break;

            }

            if (Math.round(uploadedFiles.files[i].size/1024) > 2000)  {

                errors.push("Sorry, you cannot uplod files larger than 2 Mb");
                hasErrors = true;
                break;

            }
        } 

        if (!hasErrors) {
            var form_data = new FormData($('#file-form')[0]);

            startLoadingScreen();

            $.ajax({
                type: 'POST',
                url: '/server',
                data: form_data,
                contentType: false,
                cache: false,
                processData: false,
                success: function (data) {
                    // TODO: remove the array identifiers around JSON.parse, for now we're not getting an array back, just 1 object
                    // Need to be able to send multiple files to back end, parse parse, and receive array or objects for each file sent
                    courseList = [JSON.parse(data)];
                    endLoadingScreen();
                    console.log(courseList);
                },
                error: function(error) {
                    alert("An error occurred parsing the file, please try again");
                    clearInterval(intervalId);
                    prevCarousel();
                    console.log(error);
                }
            });
            
            
        } else {

            showErrorMessages(errors);
        }

    } else {

        document.getElementById('submitFile').disabled = true;

    }
    
}

function showErrorMessages(errors) {
    let errorMsg = ""
    for (var i = 0; i < errors.length; i++) {
        errorMsg += errors[i] + ". ";
    }
    alert(errorMsg);
}

/* SLIDE 2 STUFF  */
let intervalId;
let loadingStatus;

function startLoadingScreen() {
    nextCarousel();

    // document.getElementById('backButton').disabled = true;
    let i = 0;
    if (i == 0) {
        i = 1;
        var loadingBar = document.getElementById("myBar");
        loadingStatus = 1;
        intervalId = setInterval(frame, 80);

        function frame() {
            // stall at this random 87 mark
            if (loadingStatus >= 87) {
                clearInterval(intervalId);
            } else {
                loadingStatus++;
                loadingBar.style.width = loadingStatus + "%";
                loadingBar.innerHTML = loadingStatus + "%";
            }
        }
    }

}

function endLoadingScreen() {
    clearInterval(intervalId);

    // finish the loading bar animation and go to next slide
    let loadingBar = document.getElementById("myBar");
    intervalId = setInterval(frame, 10);

    function frame() {
        if (loadingStatus >= 100) {
            clearInterval(intervalId); 
            nextCarousel();
            addCourseForms();           
        } else {
            loadingStatus++;
            loadingBar.style.width = loadingStatus + "%";
            loadingBar.innerHTML = loadingStatus + "%";
        }
    }
}

/* SLIDE 3 STUFF  */
function addCourseForms() {
    let accordion = $('#accordion');
    accordion.empty()

    // Create collapse elements according to the number of courses user is taking
    for (let i = 0; i < courseList.length; i++) {
        createCourseForm(courseList[i], i);
    }
}

function createCourseForm(course, id) {
    let accordion = $("#accordion");
    
    let quizDates = course ? course["EventsAndDates"].filter(event => Object.keys(event) == "Quiz").map(date => date["Quiz"]) : [];
    let midtermDates = course ? course["EventsAndDates"].filter(event => Object.keys(event) == "Midterm").map(date => date["Midterm"]) : [];
    
    id = course ? id : id = parseInt(accordion.children(".course-form").last().attr("id").split("-")[1]) + 1;

    let card = $(`<div class="card course-form" id="courseForm-${id}"></div>`); 
    let cardHeader = $(`<div class="card-header" id="heading${id}">
                            <h3 class="course-title"
                                data-target="#collapse-${id}"
                                data-toggle="collapse"
                                aria-expanded="true"
                                aria-controls="collapse-${id}">Course # ${id + 1}</h3>
                            <button id="deleteCourse-${id}"
                                    class="btn btn-danger delete-button"                                   
                                    onclick="removeCourse(event, ${id})">X</button>
                        </div><hr />`);

    //create body of collapse element
    let collapse = $(`<div id="collapse-${id}" class="collapse show" aria-labelledby="heading" data-parent="#accordion"></div>`);
    let cardBody = $(`<div class="card-body"></div>`);

    // put form inside the collapse body
    // TODO: server side, need to be able to grab course code from the file. currently returning ""
    let mainForm = $(`<form id="editForm-${id}" class="editFormClass">
                    <div class="form-group">
                        <label for="courseName">Course Code:</label>
                        <input name="courseName" 
                               class="courseName form-control" 
                               id="courseName${id}" 
                               type="text" 
                               value="${course != null ? course["Course Code"] : "" }" />
                    </div>
                 </form>`);                        

    let datesFormGroup = $(`<div class="form-group quiz-date-group">
                                <label for="courseDates">Quiz Dates:</label>                                
                                ${generateListDatesHTML(quizDates)}
                            </div>
                            <div class="form-group midterm-date-group">
                                <label for="courseDates">Midterm Dates:</label>                                
                                ${generateListDatesHTML(midtermDates)}
                            </div>`);

    

    //append dates to this course's form
    mainForm.append(datesFormGroup);
    
    //append it all to the accordion thing
    accordion.append(card.append(cardHeader, collapse.append(cardBody.append(mainForm))));
    accordion.append("<hr>")
}

function generateListDatesHTML(dates) {
    if(dates.length < 1) {
        return "<span><i>No Dates to Display</i></span>"
    }

    let html = "";

    for (let i = 0; i < dates.length; i++) {
        html += `<input name="courseDates"
                        class="courseDate form-control"
                        type="date" 
                        value="${getDateValue(dates[i])}" />`
    }

    return html;
}

function getDateValue(d) {
    let year = new Date(Date.now()).getFullYear();
    let dDate = new Date(d);
    let month = dDate.getMonth() + 1; // since jan starts from 0
    let day = dDate.getDate();
    // format for date input is yyyy-mm-dd
    return `${year}-${month > 9 ? month : "0" + month}-${day > 9 ? day : "0" + day}`;
}

function removeCourse(event, i) {
    if (confirm(`Are you sure you want to delete this course: Course #${i + 1}?`)) {
        var accordion = document.getElementById('accordion');
        var courseToRemove = event.target.closest(".course-form");
        accordion.removeChild(courseToRemove);
    }
}

function addNewCourse() {
    createCourseForm(null, null);
}

function acceptCourses() {
    //error occur 
    var valid = true;
    var NumberOfCard = document.getElementsByClassName('card');
    //class courseName can't assigned more than card 2
    var courseName = document.getElementsByClassName('courseName');
    // var courseInstructor = document.getElementsByClassName('courseInstructor');
    var courseDate = document.getElementsByClassName('courseDate');

    // invalid letter for instructor name format

    for (let i = 0; i < NumberOfCard.length; i++) {
        if (courseName[i].value == "" ||
            // courseInstructor[i].value == "" ||
            courseDate[i].value == "") {
            valid = false;
        }

    }

    for (let i = 0; i < NumberOfCard.length; i++) {
        /*
        TODO: 
        please allow this to also auto Capitalize the course name for the user
        */
        if (!courseName[i].value.match(/[A-Z]{4} \d{4}/)) {valid = false;} 
        // VALID Course name ex CSIS1175


        // if (!courseInstructor[i].value.match(/^[A-z ]+$/)) {valid = false;}
        // VALID ONLY LETTER
//
//        if (!courseDate[i].value.match(/^[A-z ]+$/)) {valid = false;}
//        // VALID ONLY LETTER

    }

    if (valid) {
        // read all values
        // then go to another slide
        nextCarousel();
    } else {
        alert("Please fill the all the fields with valid letters");

    }
}

function nextCarousel() {
    $(".carousel").carousel("next");
}


function prevCarousel() {
    $(".carousel").carousel("prev");
}