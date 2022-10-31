//Set greeting display
const getDate = new Date();
const currTime = getDate.getHours();
const greetingSpan = document.querySelector('.greeting span');

if(currTime >= 5 && currTime < 12){
    greetingSpan.textContent = 'Good morning';
}else if (currTime >= 12 && currTime < 19){
    greetingSpan.textContent = 'Hello';
}else{
    greetingSpan.textContent = 'Good evening';
}

//Set background image 
const backgroundElem = document.querySelector('.home-container');
backgroundElem.style.backgroundImage = `url(https://source.unsplash.com/?morning)`;