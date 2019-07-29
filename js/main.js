/* --------------------------------------------------------
Script for Final Project

version: 1.0
last modified: 24.07.2019
author: Malek Gorchene
email: malek.gorchene@gmail.com
description : To Do WEB Application
----------------------------------------------------------*/

// Global Variabl
let itemsToDo = [];

// Fonction to Create complete html node
let createElementFromHTML = (htmlString)=>{
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild; 
}

// Function change String date to Date
let stringToDate = (stringDate)=>{
    stringDate = stringDate.split('-');
    return new Date(stringDate[0],(parseInt(stringDate[1])-1).toString,stringDate[2]);
}

// Function to validate name
let validateName = (name)=>{
    let valid = true;
    itemsToDo.map(item=>{
        if (item.name === name) {
            valid = false;
        }
    });
    return valid;
}

// Adding event listener with items section
let addingDeleteEventListener = (buttons)=>{
    buttons.map(item=>{
        item.addEventListener('click',deleteItem);
    });
};

// Adding show item function
let addShowItemListener = (items)=>{
    items.map(item=>{
        item.addEventListener('click',showItem);
    });
};


// Form Validation
let ValidateAndAdd = ()=>{
    let name = document.querySelector('#name').value;
    let dateBegin = document.querySelector('#dateD').value;
    let dateEnd = document.querySelector('#dateF').value;
    let description = document.querySelector('#description').value;
    let formTab = [name,dateBegin,dateEnd,description];
    // Create today date
    let dateNow = Date.now();

    // Validate all input
    for (let item in formTab){
        if(!item){
            alert('All input are required');
            return;
        }
        
    }

    // Validate name
    let nameLength = name.length;
    if(nameLength < 8 || nameLength > 24){
        alert('Name should be between 8 and 24 chars');
        return;
    }
    if (!validateName(name)) {
        alert('Name already exist');
        return;
    }

    // Validate date beginning
    if (stringToDate(dateBegin)<dateNow) {
        alert('Begginning date must be greater or equal than today date');
        return;
    }

    // Validate date end
    if (stringToDate(dateEnd)<stringToDate(dateBegin)) {
        alert('Ending date must be greater or equal than beginning date');
        return;
    }

    // Validate description
    let descriptionLength = description.length;
    if(descriptionLength < 24){
        alert('Description must have 24 chars at least');
        return;
    }

    // Adding new item To Do
    itemsToDo.push({
        name : name,
        dateBegin : dateBegin,
        dateEnd : dateEnd,
        description : description,
        percent : 0
    });
    let items = document.querySelector('#items');
    let strToAdd = `<div class="toast show animated jello" id="${name}" data-percent="0">
                        <div class="toast-header">
                            <strong class="mr-auto">${name}</strong>
                            <small class="mr-2">0%</small>
                            <a href="#" class="badge badge-danger"><img class="svg-white" src="images/trashcan.svg" alt="delete"></a>
                        </div>
                    </div>`;
    let item = createElementFromHTML(strToAdd);
    items.prepend(item);

    // Adding Delete item Event
    let buttonDelete = Array.from(document.querySelectorAll('#items .toast .badge-danger'));
    addingDeleteEventListener(buttonDelete);

    // Adding Show detail event listener
    let itemsDiv = Array.from(document.querySelectorAll('#items .toast'));
    addShowItemListener(itemsDiv);

    // Reset input after adding item To Do
    resetForm();

    return;


}

// Hide complete items function
let hideComplete = function(event){
    Array.from(this.children).map(item=>{item.classList.toggle('d-none')});
    let items = Array.from(document.querySelectorAll('#items>div'));
    items.map(item=>{
        if(item.dataset.percent === '100'){
            item.classList.toggle('d-none');
        }
    });
};

// Reset form values
let resetForm = ()=>{
    let form = Array.from(document.querySelectorAll('input,textarea'));
    form.map(item=>{
        item.value = "";
    });
};

// Seach for item
let searchItem = ()=>{
    let valueToSearch = document.querySelector('#notes input').value;
    let items = Array.from(document.querySelectorAll('#items>div'));
    // filter items wich dont follow the search and hide it
    if (valueToSearch) {
        items.filter(item=> !(item.id.indexOf(valueToSearch)+1)).forEach((item)=>{item.classList.add('d-none')});
    } else {
        items.forEach((item)=>{item.classList.remove('d-none')});
    }
    
};

// Empty search item
let changePourcent = function(){
    let pourcentValue = document.querySelector('#progressPercent').value;
    document.querySelector('#percent>span').textContent = pourcentValue;
    
};

// Delete item 
let deleteItem = function(event){
    event.preventDefault();
    // Stop propagation to not infect the toast click
    event.stopPropagation();
    let confirmPromise = new Promise((resolve,reject)=>{
        resolve(confirm('Do you want to delete this element ?'));
    });
    confirmPromise.then((confirm)=>{
        if (confirm) {
            let name = this.parentNode.parentNode.id;
            let element = this.parentNode.parentNode;
            let indexItem = itemsToDo.findIndex(item=>item.name = name);
            itemsToDo.splice(indexItem,1);
            document.querySelector('#items').removeChild(element); 
            nameShown = document.querySelector('#pending > div h3').textContent;
            if(name === nameShown)
            document.querySelector('#pending > div').innerHTML = `<div class="text-center col-12 animated flipInX">
                                                                        <h4>Item To Do</h4>
                                                                    </div>`;
                    
        }
    });
    
};


// Show item
let showItem = function(){
    let pending = document.querySelector('#pending > div');
    let name = this.id;
    let infoItem = itemsToDo.find(item=> item.name === name);
    let strToAdd = `<div class="text-center col-12 animated flipInX">
                        <h4>Item To Do</h4>
                    </div>
                    <div class="col-md-3 animated flipInX">
                        <h3>${infoItem.name}</h3>
                        <p><span><img class="svg-white mr-3" src="images/clock.svg" alt="date beginning"></span>${infoItem.dateBegin}</p>
                        <p><span><img class="svg-white mr-3" src="images/issue-closed.svg" alt="date end"></span>${infoItem.dateBegin}</p>
                    </div>
                    <div class="col-md-9 animated flipInX d-flex flex-column justify-content-between">
                        <p>${infoItem.description}</p>
                        <div class="d-flex justify-content-between">
                            <input type="range" class="custom-range" id="progressPercent" min="0" max="100" value="${infoItem.percent}"><span id="percent" class="ml-2"><span>${infoItem.percent}</span>%</span>
                        </div>
                        <button type="button" class="btn btn-outline-primary btn-sm float-right align-self-end">Save</button>
                    </div>`;
    pending.innerHTML = strToAdd;
    let savePercentButton = document.querySelector('#pending button');
    let pourcentRange = document.querySelector('#progressPercent');
    pourcentRange.addEventListener('change',changePourcent);
    savePercentButton.addEventListener('click',savePercent);
}

// Save percent To Do item
let savePercent = ()=>{
    let percent = document.querySelector('#progressPercent').value;
    let name = document.querySelector('#pending h3').textContent;
    itemsToDo.map(item=>{
        if (item.name === name) {
            item.percent = percent;
        }
    });
    let item = document.getElementById(name);
    item.dataset.percent = percent;
    if(percent === '100'){
        item.querySelector('small').innerHTML = `<img class="svg-white" src="images/checklist.svg" alt="delete">`;
    }else{
        item.querySelector('small').textContent = `${percent}%`;
    }

};

// Buttons with event listener
let addModifItem = document.querySelector('#formulaire>div:last-child>button');
let resetItems = document.querySelector('#formulaire>div:last-child>button:last-child');
let hideItems = document.querySelector('#notes>div:nth-child(2)>div>button:last-child');
let searchItems = document.querySelector('#notes>div:nth-child(2)>div>button');
let searchInput = document.querySelector('#notes input');



// add Event listener

addModifItem.addEventListener('click',ValidateAndAdd);
resetItems.addEventListener('click',resetForm);
hideItems.addEventListener('click',hideComplete);
searchItems.addEventListener('click',searchItem);