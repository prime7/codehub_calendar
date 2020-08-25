window.onload = function() {
    document.querySelector('#file-upload').addEventListener('change', handleFileSelect, false);  
}

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
                    endLoadingScreen(JSON.parse(data));
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

function endLoadingScreen(data) {
    clearInterval(intervalId);

    // finish the loading bar animation and go to next slide
    let loadingBar = document.getElementById("myBar");
    intervalId = setInterval(frame, 10);

    function frame() {
        if (loadingStatus >= 100) {
            clearInterval(intervalId); 
            nextCarousel();
            addCourseForms(data);           
        } else {
            loadingStatus++;
            loadingBar.style.width = loadingStatus + "%";
            loadingBar.innerHTML = loadingStatus + "%";
        }
    }
}

/* SLIDE 3 STUFF  */
function addCourseForms(courses) {

    //for now: courses is just 1 object, Eventually would be good to get back an array
    let courseList = [courses];

    let accordion = $('#accordion');
    accordion.empty()

    // Create collapse elements according to the number of courses user is taking
    for (let i = 0; i < courseList.length; i++) {
        createCourseForm(courseList[i], i);
    }
}

function createCourseForm(course, id) {
    let accordion = $("#accordion");

    if (course == null) {
        id = accordion.children(".card").length;
    }

    let card = $(`<div class="card" id="card${id}"></div>`); 
    let cardHeader = $(`<div class="card-header" id="heading${id}">
                            <h5 class="course-title"
                                data-target="#collapse${id}"
                                data-toggle="collapse"
                                aria-expanded="true"
                                aria-controls="collapse${id}">Course # ${id + 1}</h5>
                            <button id="deleteCourse${id}"
                                    class="btn btn-danger delete-button"                                   
                                    onclick="removeCourse(${id})">X</button>
                        </div>`);

    //create body of collapse element
    let collapse = $(`<div id="collapse${id}" class="collapse show" aria-labelledby="heading" data-parent="#accordion"></div>`);
    let cardBody = $(`<div class="card-body"></div>`);

    // put form inside the collapse body
    let form = $(`<form id="editForm${id}" class="editFormClass">
                    <div class="form-group">
                        <label for="courseName">Course Code:</label>
                        <input name="courseName" 
                               class="courseName form-control" 
                               id="courseName${id}" 
                               type="text" 
                               value="${course != null ? course["Course Code"] : "" }" />
                    </div>
                 </form>`);                        

    let datesFormGroup = $(`<div class="form-group">
                                <label for="courseDates">Important Dates:</label>
                                <input name="courseDates"
                                       class="courseDate form-control"
                                       type="date" 
                                       value="2020-01-02" />
                            </div>`);

    //append it all
    form.append(datesFormGroup);
    cardBody.append(form);
    collapse.append(cardBody);
    card.append(cardHeader, collapse);
    accordion.append(card);
}

function removeCourse(i) {
    var conf = confirm("Do you want to delete Course #" + (i + 1) + "?");
    if (conf) {
        var accordion = document.getElementById('accordion');
        var courseToRemove = document.getElementById('card' + i);
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