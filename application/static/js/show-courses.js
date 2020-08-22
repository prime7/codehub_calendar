window.onload = function() {
    init();
}

function init() {
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

            $.ajax({
                type: 'POST',
                url: '/server',
                data: form_data,
                contentType: false,
                cache: false,
                processData: false,
                success: function (data) {
                    console.log(data);
                },
                error: function(error) {
                    alert("An error occurred parsing the file, please try again");
                    console.log(error);
                }
            });
            
            startLoadingScreen();
            
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
function startLoadingScreen() {

    // $("#carouselExampleIndicators").carousel(1);
    nextCarousel();

    // document.getElementById('backButton').disabled = true;

    setTimeout(function () {
        let i = 0;
        if (i == 0) {
            i = 1;
            var elem = document.getElementById("myBar");
            var width = 1;
            var id = setInterval(frame, 10);

            function frame() {
                if (width >= 100) {
                    clearInterval(id);
                    i = 0;
                    // document.getElementById('backButton').disabled = false;
                    setTimeout(function() {
                        nextCarousel();
                        addCourseForms();
                    }, 1000);
                } else {
                    width++;
                    elem.style.width = width + "%";
                    elem.innerHTML = width + "%";
                }
            }
        }
    }, 1500);

}

// function next() {
//     // $("#carouselExampleIndicators").carousel(2);
//     nextCarousel();
//     addCourseForms();
// }

/* SLIDE 3 STUFF  */
function addCourseForms() {

    var accordion = document.getElementById('accordion');

    // Check if we have child nodes 
    // If yes - remove them
    if (accordion.hasChildNodes()) {
        for (var i = 0; i < accordion.childNodes.length; i++) {
            accordion.removeChild(accordion.childNodes[i]);
            // console.log(accordion.childNodes[i]);
        }
    }

    // Create collapse elements according to the number of courses user is taking
    for (i = 0; i < 3; i++) {

        var card = document.createElement('div');
        card.setAttribute('class', 'card');
        card.setAttribute('id', 'card' + i);

        // collapse header
        var cardHeader = document.createElement('div');
        cardHeader.setAttribute('id', 'heading' + i);
        cardHeader.setAttribute('class', 'card-header');

        var header5 = document.createElement('h5');
        header5.setAttribute('class', 'mb-0');

        var collapseButton = document.createElement('button');
        collapseButton.setAttribute('class', 'btn btn-link');
        collapseButton.setAttribute('data-toggle', 'collapse');
        collapseButton.setAttribute('data-target', '#collapse' + i);
        collapseButton.setAttribute('aria-expanded', 'true');
        collapseButton.setAttribute('aria-controls', 'collapse' + i);
        collapseButton.textContent = 'Course #' + (i + 1);

        var deleteButton = document.createElement('input');
        deleteButton.setAttribute('id', 'deleteCourse' + i);
        deleteButton.setAttribute('class', 'btn-danger');
        deleteButton.setAttribute('type', 'submit');
        deleteButton.setAttribute('value', 'X');
        deleteButton.setAttribute("style", 'float: right; height: 30px; width: 30px');
        deleteButton.setAttribute("onclick", 'removeCourse(' + i + ');');


        cardHeader.appendChild(header5);
        cardHeader.appendChild(collapseButton);
        cardHeader.appendChild(deleteButton);

        //create body of collapse element
        var collapse = document.createElement('div');
        collapse.setAttribute('id', 'collapse' + i);
        collapse.setAttribute('class', 'collapse show');
        collapse.setAttribute('aria-labelledby', 'heading' + i);
        collapse.setAttribute('data-parent', '#accordion');

        var cardBody = document.createElement('div');
        cardBody.setAttribute('class', 'card-body');

        // put form inside the collapse body
        var form = document.createElement('form');
        form.setAttribute('id', 'editForm' + i);
        form.setAttribute('class', 'editFormClass' + i);

        var courseNameLabel = document.createElement('span');
        courseNameLabel.textContent = "Course Name: ";

        var courseNameInput = document.createElement('input');
        courseNameInput.setAttribute('id', 'courseName' + i);
        courseNameInput.setAttribute('type', 'text');
        courseNameInput.setAttribute('min', '4');
        courseNameInput.setAttribute('class', 'courseName');

        var newLine = document.createElement('br');

        form.appendChild(courseNameLabel);
        form.appendChild(courseNameInput);
        form.appendChild(newLine);

        var courseInstrLabel = document.createElement('span');
        courseInstrLabel.textContent = "Instructor: ";
        var courseInstrInput = document.createElement('input');
        //        courseInstrInput.setAttribute('id', 'courseInstructor' + i);
        courseInstrInput.setAttribute('type', 'text');
        courseInstrInput.setAttribute('min', '4')
        courseInstrInput.setAttribute('class', 'courseInstructor');

        var newLine = document.createElement('br');
        form.appendChild(courseInstrLabel);
        form.appendChild(courseInstrInput);
        form.appendChild(newLine);

        var courseDateLabel = document.createElement('span');
        courseDateLabel.textContent = "Date: ";
        var courseDateInput = document.createElement('input');
        //        courseDateInput.setAttribute('id', 'courseDate' + i);
        courseDateInput.setAttribute('type', 'text');
        courseDateInput.setAttribute('min', '4')
        courseDateInput.setAttribute('class', 'courseDate');

        var newLine = document.createElement('br');
        form.appendChild(courseDateLabel);
        form.appendChild(courseDateInput);
        form.appendChild(newLine);

        cardBody.appendChild(form);

        collapse.appendChild(cardBody);

        card.appendChild(cardHeader);
        card.appendChild(collapse);

        accordion.appendChild(card);
    }

    var addNewCourseBtn = document.createElement('input');
    addNewCourseBtn.setAttribute('type', 'submit');
    addNewCourseBtn.setAttribute('value', '+');
    addNewCourseBtn.setAttribute('id', 'addNewCourse');
    addNewCourseBtn.setAttribute('onclick', 'addNewCourse();');

    accordion.appendChild(addNewCourseBtn);

    var acceptButton = document.createElement('input');
    acceptButton.setAttribute('type', 'submit');
    acceptButton.setAttribute('value', 'Accept');
    acceptButton.setAttribute('id', 'acceptButton');
    acceptButton.setAttribute('onclick', 'acceptCourses();');
    // acceptButton.setAttribute('hidden', true);

    // var acceptCoursesLabel = document.createElement('label');
    // acceptCoursesLabel.setAttribute('onclick', 'acceptCourses');
    // acceptCoursesLabel.setAttribute('id', 'acceptCoursesLabel');
    // acceptCoursesLabel.setAttribute('class', 'carousel-control-next');
    // acceptCoursesLabel.setAttribute('for', 'acceptButton');
    // acceptCoursesLabel.textContent = "Accept";

    accordion.appendChild(acceptButton);
    // accordion.appendChild(acceptCoursesLabel);

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

    var accordion = document.getElementById('accordion');

    // Remove buttons
    var addNewCourse = document.getElementById('addNewCourse');
    accordion.removeChild(addNewCourse);

    var acceptButton = document.getElementById('acceptButton');
    accordion.removeChild(acceptButton);

    // Get last course id on the page
    // if there is no courses to edit yet
    var i;

    try {

        var allCards = document.getElementsByClassName('card');

        var lastCard = allCards[allCards.length - 1].getAttribute('id');
        var lastCardLength = (allCards[allCards.length - 1].getAttribute('id').length);
        var lastIdx = parseInt(lastCard[lastCardLength - 1]);

        i = lastIdx + 1;
    } catch {
        i = 0;
    }

    var card = document.createElement('div');
    card.setAttribute('class', 'card');
    card.setAttribute('id', 'card' + i);

    // collapse header
    var cardHeader = document.createElement('div');
    cardHeader.setAttribute('id', 'heading' + i);
    cardHeader.setAttribute('class', 'card-header');

    var header5 = document.createElement('h5');
    header5.setAttribute('class', 'mb-0');

    var collapseButton = document.createElement('button');
    collapseButton.setAttribute('class', 'btn btn-link');
    collapseButton.setAttribute('data-toggle', 'collapse');
    collapseButton.setAttribute('data-target', '#collapse' + i);
    collapseButton.setAttribute('aria-expanded', 'true');
    collapseButton.setAttribute('aria-controls', 'collapse' + i);
    collapseButton.textContent = 'Course #' + (i + 1);

    var deleteButton = document.createElement('input');
    deleteButton.setAttribute('id', 'deleteCourse' + i);
    deleteButton.setAttribute('class', 'btn-danger');
    deleteButton.setAttribute('type', 'submit');
    deleteButton.setAttribute('value', 'X');
    deleteButton.setAttribute("style", 'float: right; height: 30px; width: 30px');
    deleteButton.setAttribute("onclick", 'removeCourse(' + i + ');');

    cardHeader.appendChild(header5);
    cardHeader.appendChild(collapseButton);
    cardHeader.appendChild(deleteButton);

    //create body of collapse element
    var collapse = document.createElement('div');
    collapse.setAttribute('id', 'collapse' + i);
    collapse.setAttribute('class', 'collapse show');
    collapse.setAttribute('aria-labelledby', 'heading' + i);
    collapse.setAttribute('data-parent', '#accordion');

    var cardBody = document.createElement('div');
    cardBody.setAttribute('class', 'card-body');

    // put form inside the collapse body
    var form = document.createElement('form');
    form.setAttribute('id', 'editForm' + i);
    form.setAttribute('class', 'editFormClass' + i);

    var courseNameLabel = document.createElement('span');
    courseNameLabel.textContent = "Course Name: ";

    var courseNameInput = document.createElement('input');
    courseNameInput.setAttribute('id', 'courseName' + i);
    courseNameInput.setAttribute('type', 'text');
    courseNameInput.setAttribute('min', '4')

    var newLine = document.createElement('br');

    form.appendChild(courseNameLabel);
    form.appendChild(courseNameInput);
    form.appendChild(newLine);

    var courseInstrLabel = document.createElement('span');
    courseInstrLabel.textContent = "Instructor: ";
    var courseInstrInput = document.createElement('input');
    courseInstrInput.setAttribute('id', 'courseInstructor' + i);
    courseInstrInput.setAttribute('type', 'text');
    courseInstrInput.setAttribute('min', '4')

    var newLine = document.createElement('br');
    form.appendChild(courseInstrLabel);
    form.appendChild(courseInstrInput);
    form.appendChild(newLine);

    var courseDateLabel = document.createElement('span');
    courseDateLabel.textContent = "Date: ";
    var courseDateInput = document.createElement('input');
    courseDateInput.setAttribute('id', 'courseDate' + i);
    courseDateInput.setAttribute('type', 'text');
    courseDateInput.setAttribute('min', '4')

    var newLine = document.createElement('br');
    form.appendChild(courseDateLabel);
    form.appendChild(courseDateInput);
    form.appendChild(newLine);

    cardBody.appendChild(form);

    collapse.appendChild(cardBody);

    card.appendChild(cardHeader);
    card.appendChild(collapse);

    accordion.appendChild(card);

    // Return buttons
    var addNewCourseBtn = document.createElement('input');
    addNewCourseBtn.setAttribute('type', 'submit');
    addNewCourseBtn.setAttribute('value', '+');
    addNewCourseBtn.setAttribute('id', 'addNewCourse');
    addNewCourseBtn.setAttribute('onclick', 'addNewCourse();');

    accordion.appendChild(addNewCourseBtn);

    var acceptButton = document.createElement('input');
    acceptButton.setAttribute('type', 'submit');
    acceptButton.setAttribute('value', 'Accept');
    acceptButton.setAttribute('id', 'acceptButton');
    acceptButton.setAttribute('onclick', 'acceptCourses();');

    accordion.appendChild(acceptButton);

}

function acceptCourses() {
    //error occur 
    var valid = true;
    var NumberOfCard = document.getElementsByClassName('card');
    //class courseName can't assigned more than card 2
    var courseName = document.getElementsByClassName('courseName');
    var courseInstructor = document.getElementsByClassName('courseInstructor');
    var courseDate = document.getElementsByClassName('courseDate');

    // invalid letter for instructor name format

    for (let i = 0; i < NumberOfCard.length; i++) {
        if (courseName[i].value == "" ||
            courseInstructor[i].value == "" ||
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


        if (!courseInstructor[i].value.match(/^[A-z ]+$/)) {valid = false;}
        // VALID ONLY LETTER
//
//        if (!courseDate[i].value.match(/^[A-z ]+$/)) {valid = false;}
//        // VALID ONLY LETTER

    }

    if (valid) {
        // read all values
        // then go to another slide
        // $("#carouselExampleIndicators").carousel(3);
        nextCarousel();
    } else {
        alert("Please fill the all the fields with valid letters");

    }
}

function nextCarousel() {
    $(".carousel").carousel("next");
}


