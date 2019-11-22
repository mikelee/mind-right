// Elements
const popup = document.querySelector('.popup');
const shuffleBtn = document.querySelector('#shuffle');
const addBtn = document.querySelector('#add');
const closeBtn = document.querySelector('.popup--close');
const display = document.querySelector('.display');
const text = document.querySelector('.text');
const addImageBtn= document.querySelector('#addImage');
const popupImage = document.querySelector('.popupImage');
const textInput = document.querySelectorAll('input[type="text"]');
const saveBtn = document.querySelectorAll('.saveBtn');
const deleteBtn = document.querySelectorAll('.deleteBtn');
const inputs = document.querySelectorAll('input[type="text"]');
const list = document.querySelector('.list');


const shuffleDisplay = () => {
    fetch('http://localhost:7777/result')
    .then(response => response.json())
    .then(data => {
        if (data.randomItem.image !== '') {
            display.style.backgroundImage = `url(${data.randomItem.image})`;
        } else {
            display.style.backgroundImage = 'url(https://images.unsplash.com/photo-1452784444945-3f422708fe5e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1504&q=80)';
        }
        
        if (data.randomItem.quote !== '') {
            text.textContent = data.randomItem.quote;
        } else {
            text.textContent = '';
        }
        
    })
    .catch(err => {
        console.log(err);
        return err;
    })
}

// Event Listeners
if (shuffleBtn) {
    shuffleBtn.addEventListener('click', shuffleDisplay);
}

if (addBtn) {
    addBtn.addEventListener('click', function() {
        popup.style.visibility = 'visible';
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', function() {
        popup.style.visibility = 'hidden';
    });
}

if (addImageBtn) {
    addImageBtn.addEventListener('click', function() {
        popup.style.visibility = 'visible';
        console.log('clicked');
    });
}