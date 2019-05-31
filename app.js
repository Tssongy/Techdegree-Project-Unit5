const url = 'https://randomuser.me/api/?nat=us,au,nz&results=12';

// Create and append the basic html template for form
function createForm(){
    $('.search-container').html(`<form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>`)
    $('#search-input').on('keyup', searchName);
    $('#search-submit').on('click', searchName);
}

// Create and append the basic html template for Modal view
function createModal(){
    $("<div/>", { 
        class: "modal-container" 
    }).appendTo("body");
    $(".modal-container")
    .html( `<div class="modal">
    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong>
    </button>
    <div class="modal-info-container">
    <img class="modal-img" src="https://placehold.it/125x125" 
    alt="profile picture">
    <h3 id="name" class="modal-name cap">name</h3>
    <p class="modal-text">email</p>
    <p class="modal-text cap">city</p><hr>
    <p class="modal-text">(555) 555-5555</p>
    <p class="modal-text">123 Portland Ave., Portland, OR 97204</p>
    <p class="modal-text">Birthday: 10/21/2015</p>
    </div>
    <div class="modal-btn-container">
    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
    <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div>
    </div>` );

    $(".modal-container").hide();
    $('#modal-close-btn').on('click', () =>  $('.modal-container').hide());
}

// Initialize the page
function init(){
    createForm();
    createModal();
    
}

//Fetch the information from the random user generator website
async function getEmployeeInfo(url){
    try{
        const employeeInfo = await fetch(url);
        const employeeInfoJSON = await employeeInfo.json();
        return employeeInfoJSON;
    } catch (error){
        throw error;
    }
}


function generateProfile(data){ 
    data.results.forEach( (employee, index) => {
        $("<div/>", { 
            class: "card" 
        }).appendTo("#gallery").html(
           `<div class="card-img-container">
                <img class="card-img" src=${employee.picture.large} alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                <p class="card-text">${employee.email}</p>
                <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
            </div>`).on('click',(e) => {

                //Prevent duplicating event listeners
                $('#modal-prev').off('click');
                $('#modal-next').off('click');
    
                showModal(employee);
                
                // Redirect the clicked target so that it is always the 'card' element
                if(e.target.className !== 'card'){
                    if(e.target.className === 'card-info-container' || e.target.className === 'card-img-container' ){
                        e.target = e.target.parentNode;
                    }
                    else{
                        e.target = e.target.parentNode.parentNode;
                    }
                    
                }

                // Disable buttons previous & next buttons if there are no more employees
                if(e.target.previousElementSibling){
                    $('#modal-prev').removeAttr('disabled');
                }
                else{
                    $('#modal-prev').attr('disabled',true);
                }

                if(e.target.nextElementSibling){
                    $('#modal-next').removeAttr('disabled');
                }
                else{
                    $('#modal-next').attr('disabled',true);
                }

                //Show the previous employee's information when the prev button is clicked
                $('#modal-prev').on('click', (event) => {
                    event.target.parentNode.parentNode.parentNode.style.display ='none';
                        e.target.previousElementSibling.click();  
                })
                //Show the next employee's infomation when the next button is clicked
                $('#modal-next').on('click', (event) => {
                    event.target.parentNode.parentNode.parentNode.style.display ='none';
                        e.target.nextElementSibling.click();
                })
            });
    })
}


//Enable search function for the names of the employees
function searchName(){
    var key = $('#search-input').val(); 
    const names = document.querySelectorAll('#name');

    for(let i =0; i<names.length; i++){
        if(names[i].textContent.match(key.toLowerCase())){
            names[i].parentNode.parentNode.style.display ='';
        }
        else{
            names[i].parentNode.parentNode.style.display ='none';
        }
    }
}

// Update the modal template with the clicked employee information
function showModal(employee){
    var day = employee.dob.date.slice(8,10);
    var month = employee.dob.date.slice(5,7);
    var year = employee.dob.date.slice(0,4);

    $('.modal-container').show()
    $('.modal-img').attr('src',employee.picture.large);
    $('.modal-container h3').text(`${employee.name.first} ${employee.name.last}`);
    $('.modal-text:first').text(employee.email);
    $('.modal-text:nth-of-type(2)').text(employee.location.city);
    $('.modal-text:nth-of-type(3)').text(employee.phone);
    $('.modal-text:nth-of-type(4)').text(`${employee.location.street} ${employee.location.state} ${employee.location.postcode}`);
    $('.modal-text:last').text(`Birthday: ${day}/${month}/${year}`);
}


init();
getEmployeeInfo(url)
    .then(data => generateProfile(data))
    .catch( e => {
        document.querySelector('#gallery').innerHTML ='<h3> Something went wrong! </h3>';
        console.error(e);
    });