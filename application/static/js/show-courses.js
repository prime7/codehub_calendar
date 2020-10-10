/*  VARIABLES */
var courseList = [];
var uploadedFiles = [];

// Add animations dynamically to DOM elements
// Pass the JQuery object to animate with the animation name
// Will add animated class and animation to play
// And remove animation classes at the end of the animation
const animateCSS = ($element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;

    $element.addClass(`${prefix}animated ${animationName} animate__faster`);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd() {
      $element.removeClass(`${prefix}animated ${animationName} animate__faster`);
      resolve('Animation ended');
    }

    $element[0].addEventListener('animationend', handleAnimationEnd, {once: true});
  });

/* HOME PAGE  */
function handleFileSelect(e) {
    let selDiv = $("#selectedFiles");

    if (!e.target.files) {
        return;
    }

    selDiv.empty();
    uploadedFiles = [];

    let files = e.target.files;
    for (var i = 0; i < files.length; i++) {
        let f = files[i];

        selDiv.append(f.name + "<br/>");
        uploadedFiles.push(f.name);
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

/* LOADING PAGE  */
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
            addCourseForms(courseList);           
        } else {
            loadingStatus++;
            loadingBar.style.width = loadingStatus + "%";
            loadingBar.innerHTML = loadingStatus + "%";
        }
    }
}

/* COURSE DATE EDITTING PAGE  */
function addCourseForms(courses) {
    let accordion = $('#accordion');
    accordion.empty()

    // Create collapse elements according to the number of courses user is taking
    for (let i = 0; i < courses.length; i++) {
        createCourseForm(courses[i], i, uploadedFiles[i]);
    }
}

function createCourseForm(course, id, filename) {
    let accordion = $("#accordion");
    
    let quizDates = course ? course["EventsAndDates"].filter(event => Object.keys(event) == "Quiz").map(date => date["Quiz"]) : [];
    let midtermDates = course ? course["EventsAndDates"].filter(event => Object.keys(event) == "Midterm").map(date => date["Midterm"]) : [];
    
    id = course ? id : id = parseInt(accordion.children(".course-form").last().attr("id").split("-")[1]) + 1;

    let card = $(`<div class="card course-form" id="courseForm-${id}"></div>`); 
    let cardHeader = $(`<div class="card-header" id="heading${id}">
                            <h3 class="course-title">
                                ${filename}                                                           
                                <span class="accordion-data-expand-control" 
                                data-target="#collapse-${id}"
                                data-toggle="collapse"
                                aria-expanded="true"
                                aria-controls="collapse-${id}"
                                onclick="toggleDataExpandAppearance(event)">
                                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-file-minus" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M4 0h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H4z"/>
                                    <!-- minus symbol -->
                                    <path class="plus-minus" fill-rule="evenodd" d="M5.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z"/>
                                    <!-- plus symbol -->
                                    <path class="plus-minus hide" fill-rule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5z"/>
                                    </svg>
                                </span>
                            </h3>
                            <button id="deleteCourse-${id}"
                                    class="btn btn-danger delete-button"                                   
                                    onclick="removeCourse(event, ${id})">X</button>
                        </div><hr />`);

    //create body of collapse element
    let collapse = $(`<div id="collapse-${id}" class="collapse show multi-collapse"></div>`);
    let cardBody = $(`<div class="card-body"></div>`);

    // put form inside the collapse body
    // TODO: server side, need to be able to grab course code from the file. currently returning ""
    let mainForm = $(`<form id="editForm-${id}" class="editFormClass" onSubmit="event.preventDefault();">
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
                            <button class="btn btn-dark add-date-btn" for="quiz-date-group" onclick="addDate(event)">+ Add Quiz Date</button>
                            <div class="form-group midterm-date-group">
                                <label for="courseDates">Midterm Dates:</label>                                
                                ${generateListDatesHTML(midtermDates)}                                
                            </div>
                            <button class="btn btn-dark add-date-btn" for="midterm-date-group" onclick="addDate(event)">+ Add Midterm Date</button>
                            `);

    

    //append dates to this course's form
    mainForm.append(datesFormGroup);
    
    //append it all to the accordion thing
    accordion.append(card.append(cardHeader, collapse.append(cardBody.append(mainForm))));
    accordion.append("<hr>")
}

function toggleDataExpandAppearance(event) {
    $(event.target).find(".plus-minus").toggleClass("hide");
    console.log($(event.target).find(".plus-minus"));
}

function generateListDatesHTML(dates) {
    let html = "";

    for (let i = 0; i < dates.length; i++) {
        html += getDateHTML(getDateValue(dates[i]));
    }

    return html;
}

function getDateHTML(d, customClass) {
    return `<div class="date-group ${customClass || ""}">
                <input name="courseDates"
                class="courseDate form-control"
                type="date" 
                value="${d}"/>
                <button class="btn btn-danger remove-date-btn" title="Remove Date" onclick="removeDate(event)">X</button>
            </div>`;
}

function addDate(e) {
    e.preventDefault();
    let $dateGroup = $(`.${$(e.target).attr("for")}`);
    let $newDate = $(getDateHTML(getDateValue(Date.now()), ""));
    $dateGroup.append($newDate);
    animateCSS($newDate, 'zoomIn');
}

function removeDate(e) {
    e.preventDefault();
    let elemToRemove = $(e.target).closest(".date-group");
    if(confirm("Are you sure you want to delete this?"))
        animateCSS(elemToRemove, 'zoomOut').then((message) => {
            elemToRemove.remove();
        });    
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
    // [course object, id, course name]
    createCourseForm(null, $(".course-form").length, "Custom Course");
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