var i = 0;

function move() {
    if (i == 0) {
        i = 1;
        var elem = document.getElementById("myBar");
        var width = 1;
        var id = setInterval(frame, 10);

        function frame() {
            if (width >= 100) {
                clearInterval(id);
                i = 0;
            } else {
                width++;
                elem.style.width = width + "%";
            }
        }
    }
}

var selDiv = "";

document.addEventListener("DOMContentLoaded", init, false);

function init() {
    document.querySelector('#file-upload').addEventListener('change', handleFileSelect, false);
    selDiv = document.querySelector("#selectedFiles");
}

function handleFileSelect(e) {

    if (!e.target.files) return;

    selDiv.innerHTML = "";

    var files = e.target.files;
    for (var i = 0; i < files.length; i++) {
        var f = files[i];

        selDiv.innerHTML += f.name + "<br/>";

    }

}


function addCourseForms() {

    var accordion = document.getElementById('accordion');

    // Check if we have child nodes 
    // If yes - remove them
    if (accordion.hasChildNodes()) {
        for(var i = 0; i < accordion.childNodes.length; i++) {
            accordion.removeChild(accordion.childNodes[i]);
            // console.log(accordion.childNodes[i]);
        }
    }

    // Create collapse elements according to the number of courses user is taking
    for (i = 0; i < 3; i++ ) {

        var card = document.createElement('div');
        card.setAttribute('class', 'card');

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
        collapseButton.textContent = 'Course #' + (i+1);

        cardHeader.appendChild(header5);
        cardHeader.appendChild(collapseButton);

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
        
        var courseNameLable = document.createElement('span');
        courseNameLable.textContent = "Course Name: ";

        var courseNameInput = document.createElement('input');
        courseNameInput.setAttribute('id', 'courseName' + i);
        courseNameInput.setAttribute('type', 'text');
        courseNameInput.setAttribute('min', '4')

        form.appendChild(courseNameLable);
        form.appendChild(courseNameInput);

        cardBody.appendChild(form);

        collapse.appendChild(cardBody);
        
        card.appendChild(cardHeader);
        card.appendChild(collapse);

        accordion.appendChild(card);
    }

    var acceptButton = document.createElement('input');
    acceptButton.setAttribute('type', 'submit');
    acceptButton.setAttribute('value', 'Accept');
    acceptButton.setAttribute('id', 'acceptButton');

    accordion.appendChild(acceptButton);

}