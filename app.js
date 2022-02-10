
const courseApi = 'http://localhost:3000/courses';

function start(){
    getCourses(renderCourses);

    handleCreateForm();
}

start();

//Functions
function getCourses(callback){
    fetch(courseApi)
        .then(function(response){
            return response.json();
        })
        .then(callback);
}

function renderCourses(courses){
    let listCoursesBlock = document.querySelector('#list-courses');
    let htmls = courses.map(function(course){
        return `
            
            <li class="course-item-${course.id}">
                <h2>${course.name}</h2>
                <p>${course.description}</p>
                <button onclick="handleDeleteCourse(${course.id})">Delete</button>
                <button onclick="handleUpdateCourse(${course.id}, '${course.name}', '${course.description}')">Edit</button>
            </li>
            <br>
            <hr>
        `;
    });
    listCoursesBlock.innerHTML = htmls.join('');
}

function handleDeleteCourse(id){
    if(confirm("Delete?")){
        let options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        };
        fetch(courseApi + '/' + id, options)
            .then(function(response){
                return response.json();
            })
            .then(function(){
                let courseItem = document.querySelector('.course-item-' + id);
                if(courseItem){
                    courseItem.remove();
                }
            });
    }
}

function createCourse(data, callback){
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    fetch(courseApi, options)
        .then(function(response){
            return response.json();
        })
        .then(callback);
}

function handleCreateForm(){
    let createBtn = document.querySelector('#create');
    createBtn.onclick = function(){
        let name = document.querySelector("input[name='name']").value;
        let description = document.querySelector("textarea[name='description']").value;

        let formData ={
            name,
            description
        };

        createCourse(formData, function(){
            getCourses(renderCourses);
        });
    }
}

function updateCourse(courseData, id, callback) {
    let options = {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(courseData)
    };
    fetch(courseApi + "/" + id, options)
        .then(function(response) {
            return response.json()
        })
        .then(callback)
}

function handleUpdateCourse(id, oldName, oldDescription) {
    let updateBtn = document.querySelector('#create');
    updateBtn.textContent = "Update";
    let name = document.querySelector("input[name='name']");
    let description = document.querySelector("textarea[name='description']");
    let cancel = document.querySelector('#cancel');
    cancel.classList.toggle('nonedisplay');

    name.value = oldName;
    description.value = oldDescription;

    updateBtn.onclick = function(){
        if(confirm("Update it?")){
            let formData ={
                name: name.value,
                description: description.value
            };
            
            updateCourse(formData, id, function(){
                getCourses(renderCourses);
            });
        }
    }
    cancel.onclick = function(){
        name.value = '';
        description.value = '';
        cancel.classList.toggle('nonedisplay');
        updateBtn.textContent = "Create";
        handleCreateForm();
    }
}


