const articleListContainer = document.querySelector('.card-container') as HTMLElement;
const cardContainerTemplate = document.querySelector('.temp-card') as HTMLElement;
cardContainerTemplate.content 

interface Article {
    article: {
        url: string,
        title: string,
        category: string,
        cover: string,
        date: string
    }
}

function createNode(cover: string, id: number, url: string, title: string, category: string){
    const itemClone = document.importNode(cardContainerTemplate.content, true);
    let containerclone = itemClone.querySelector('div');
    let cardTitleClone = itemClone.querySelector('p');
    let cardAtagClone = itemClone.querySelector('a');

    containerclone.setAttribute('style', 'background-color');
    containerclone.setAttribute('name', category);
    containerclone.style.backgroundColor = cover;
    containerclone.setAttribute('id', id);
    cardAtagClone.setAttribute('href', url);
    cardTitleClone.innerHTML = title;

    articleListContainer.appendChild(itemClone); 
}

//Get articles
let articleArr: string[] = [];
fetch("http://localhost:3000/articles", {
    method: "GET"
}).then(response => response.json())
.then(data => {
    const dataArray = Array.from(data);
    for (const [key, value] of Object.entries(dataArray)) {
        if (value) {
            createNode(value.article.cover, value.id, value.article.url, value.article.title, value.article.category);
            articleArr.push(`${value}`);
        }
    }
    // dataArray.forEach(e => {   
    //     createNode(e.article.cover, e.id, e.article.url, e.article.title, e.article.category);
    //     articleArr.push(e);
    // })
});


const visitLinkBtn = document.querySelector('.go-link') as HTMLButtonElement;
const editBtn = document.querySelector('.edit') as HTMLButtonElement;
const deleteBtn = document.querySelector('.delete') as HTMLButtonElement;
const comfirmBtn = document.querySelector('.comfirm-btn') as HTMLButtonElement;
const editDisplay = document.querySelector('.edit-display') as HTMLElement;
//Edit
editBtn.addEventListener('click', e => {
    const parentNode = e.target.parentNode.parentNode.parentNode;
    const titleElem = parentNode.querySelector('.modal-title');
    const titleInput = parentNode.querySelector('.modal-title-input');
    const categoryElem = parentNode.querySelector('.modal-category');
    const categorySpanElem = parentNode.querySelector('.modal-category span');
    const categoryInput = parentNode.querySelector('.modal-category-input');
    const url = parentNode.querySelector('.go-link').getAttribute('href');
    const coverElem = parentNode.querySelector('.modal-header');
    const cover = window.getComputedStyle(coverElem).getPropertyValue('background-color');
    const date = parentNode.querySelector('.added-date');

    visitLinkBtn.style.display = 'none';
    deleteBtn.style.display = 'none';
    editBtn.style.display = 'none';
    editDisplay.style.display = 'block';
    
    titleElem.style.display = 'none';
    titleInput.style.display = 'block';
    titleInput.value = titleElem.textContent;
    categoryElem.style.display = 'none';
    categoryInput.style.display = 'block';
    categoryInput.value = categorySpanElem.textContent;
    comfirmBtn.style.display = 'block';

    //Set drop down height
    const selectElem = document.querySelector("#editChangeSelect") as HTMLSelectElement;
    selectElem.addEventListener("focus", e => {
        if(e.currentTarget.options.length > 4){
            e.currentTarget.size = "4";
            comfirmBtn.style.marginTop = '1rem';
        }
    });
    selectElem.addEventListener("blur", e => {
        e.currentTarget.size = "1";
        comfirmBtn.style.marginTop = '2rem';
    });


    comfirmBtn.addEventListener('click', e => {
        const changedCover = window.getComputedStyle(coverElem).getPropertyValue('background-color');
        titleElem.textContent = titleInput.value;
        categoryElem.textContent = categoryInput.value;
        titleElem.style.display = 'block';
        titleInput.style.display = 'none';
        categoryElem.style.display = 'block';
        categoryInput.style.display = 'none';
        comfirmBtn.style.display = 'none';


        //Check category diff//
        const dblowerCaseList: string[] = [];
        const prevCategory = categorySpanElem.textContent;
        const newCategory = categoryInput.value;
        if(prevCategory !== newCategory){
            //Check if other card have same value of prevCategory 
            const allCards = document.querySelectorAll('.card');
            const targeId = parentNode.querySelector('.modal-header').getAttribute('id');
            const getOtherCategories: string[] = [];
            let noDupulicationCategoryList: string[] = [];
            allCards.forEach(e => {
                //Get other cards categories array without current card's category
                if(e.getAttribute('id') !== targeId){
                    getOtherCategories.push(e.getAttribute('name'));
                }
                noDupulicationCategoryList = Array.from(new Set(getOtherCategories));
            })            

            fetch("http://localhost:3000/categories", {
            method: "GET"
            }).then(response => response.json())
            .then(data => {
                const dataArray = Array.from(data);
                dataArray.forEach(e => {
                    dblowerCaseList.push(e.category.toLowerCase());
                })
                //Target Category id
                const index = dataArray.findIndex(e => e.category === prevCategory);
                //If prevCategory does not exist in db.json
                if(noDupulicationCategoryList.indexOf(prevCategory) === -1){
                    //Delete category from db.json
                    fetch('http://localhost:3000/categories/' + index, {
                        method: 'DELETE'
                    })
                }
                //If newCategory does not exist in db.json
                if(dblowerCaseList.indexOf(newCategory) === -1){
                    //Post newCategory to db.json
                    const data = {
                        "category": newCategory
                    }
                    fetch('http://localhost:3000/categories/', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    })
                }
            })
        }

        ////////////POST edit info//////////////////
        const data = {
            "article": {
                url: url,
                title: titleInput.value,
                category: categoryInput.value,
                cover: changedCover,
                date: date.textContent
            }
          }
          const targeId = parentNode.querySelector('.modal-header').getAttribute('id');
          fetch('http://localhost:3000/articles/' + targeId, {
            method: 'PUT',   //PATCH?
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
          })
    })
})

//Edit color pic function
function editChangeColor(){
    const colorArr = [
        {"default-select": "rgb(255, 255, 255)"}, //white
        {"Orange": "rgb(250, 130, 49)"},
        {"Yellow": "rgb(255, 250, 101)"},
        {"Blue": "rgb(61, 193, 211)"},
        {"Purple": "#rgb(205, 132, 241)"},
        {"Red": "rgb(255, 56, 56)"},
        {"Pink": "rgb(255, 184, 184)"},
        {"Green": "rgb(46, 213, 115)"},
        {"Gray": "rgb(165, 177, 194)"}
    ]
    const selectedColor = document.getElementById('editChangeSelect') as HTMLSelectElement;
    const displayArea = document.querySelector('.modal-header') as HTMLElement; 
    if(selectedColor){
        const value = selectedColor.value;
        colorArr.forEach(e => {
            value === Object.keys(e)[0] && (displayArea.style.backgroundColor = `${Object.values(e)}`);
        })
    }
}


//Delete
function deleteArticle(id: number){
    fetch('http://localhost:3000/articles/' + id, {
      method: 'DELETE'
    })
}
deleteBtn.addEventListener('click', e  => {
    const msg = "Are you sure to delete this article?"
    const confirmWindow = window.confirm(msg);    

    if(confirmWindow){
        const parentElem = e.target.parentNode.parentNode.parentNode;
        const targeId = parentElem.querySelector('.modal-header').getAttribute('id');
        deleteArticle(targeId);
    }
})


//Modal window
function modalContentsSet(targetNode: HTMLElement){
    const targetColor = window.getComputedStyle(targetNode).getPropertyValue('background-color');
    const modalHeader = document.querySelector('.modal-header') as HTMLElement;
    let modalTitle = document.querySelector('.modal-title') as HTMLElement;
    let modalDate = document.querySelector('.added-date') as HTMLElement;
    let modalLink = document.querySelector('.go-link') as HTMLElement;
    let modalCategory = document.querySelector('.modal-category span') as HTMLElement;
    let modalAtag = document.querySelector('.go-link') as HTMLElement;
    //Set color
    modalHeader.style.background = `linear-gradient(180deg, ${targetColor} 50%);`;
    modalHeader.style.backgroundColor = targetColor;
    //Set title
    const targetTitle = targetNode.querySelector('.card-title') as HTMLElement;
    modalTitle.textContent = targetTitle.textContent;
    //Set url
    const targetUrlElem = targetNode.querySelector('a') as HTMLElement;
    const targetUrl = targetUrlElem.getAttribute('href');
    modalLink.setAttribute('href', `${targetUrl}`);
    //set category
    modalCategory.textContent = targetNode.getAttribute('name');
    //Set date
    const targetId = targetNode.getAttribute('id');
    const targetArticle = articleArr.filter((e) => {
        return e.id == targetId;
    })
    modalDate.textContent = targetArticle[0].article.date;
    //Set id
    modalHeader.setAttribute('id', `${targetId}`);
    // console.log(modalHeader.getAttribute('id'));
    //Set visit link
    const targetAtag = targetNode.querySelector('.card a') as HTMLElement;
    modalAtag.setAttribute('href', `${targetAtag.getAttribute('href')}`);
    }

//Modal window open
const modalWindow = document.querySelector('.modal-window-wrapper') as HTMLElement;
window.addEventListener('click', e => {
    const target = e.target as HTMLElement;
    if(target.className === 'card' || target.className === 'card-title'){        
        if(target.className === 'card'){
            modalContentsSet(target);
        }else{
            const parentNode = target.parentNode as HTMLElement;
            modalContentsSet(parentNode);
        }
        modalWindow.style.display = 'block';
    }
})

//Modal close
const closeBtn = document.querySelector('.fa-xmark') as HTMLButtonElement;
function resetEditStyle(elem: HTMLElement | null){
    const target = elem.target as HTMLElement;
    modalWindow.style.display = 'none';
    const parentNode = elem.target.parentNode.parentNode.parentNode;
    const titleElem = parentNode.querySelector('.modal-title') as HTMLElement;
    const titleInput = parentNode.querySelector('.modal-title-input') as HTMLInputElement;
    const categoryElem = parentNode.querySelector('.modal-category') as HTMLElement;
    const categoryInput = parentNode.querySelector('.modal-category-input') as HTMLInputElement;

    titleInput.value && (titleElem.textContent = titleInput.value);
    categoryInput.value && (categoryInput.textContent = categoryInput.value);

    titleElem.style.display = 'block';
    titleInput.style.display = 'none';
    categoryElem.style.display = 'block';
    categoryInput.style.display = 'none';
    comfirmBtn.style.display = 'none';

    visitLinkBtn.style.display = 'block';
    deleteBtn.style.display = 'block';
    editBtn.style.display = 'block';
    editDisplay.style.display = 'none';
}
closeBtn.addEventListener('click', e => {
    // const elem = e as HTMLElement;
    resetEditStyle(e);
})
const outsideModal = document.querySelector('.article-modal');
addEventListener('click', e => {
    if(e.target == outsideModal){
        resetEditStyle(e);
    }
})

//Set filter select option
const categoryArr = [];
const filterContainer = document.querySelector('#categorySelect') as HTMLSelectElement;

fetch("http://localhost:3000/categories", {
    method: "GET"
}).then(response => response.json())
.then(data => {
    const dataArray = Array.from(data);
    dataArray.forEach(e => {   
        categoryArr.push(e.category);
        const optionTemplate = document.querySelector('.temp-option') as HTMLElement;
        const optionClone = document.importNode(optionTemplate.content, true);
        let optionCloneElem = optionClone.querySelector('.option-elem');
        
        optionCloneElem.setAttribute('value', e.category);
        optionCloneElem.textContent = e.category;
        filterContainer.appendChild(optionCloneElem);
    })
});


//Filter function
function filterCategory(){
    const selectElem = document.querySelector('#categorySelect') as HTMLSelectElement;
    const allCardList = Array.from(document.querySelectorAll('.card'));

    if(selectElem){
        const selectedValue = selectElem.value;
        for(let i = 0; i < allCardList.length; i++){            
            if(allCardList[i].getAttribute('name') == selectedValue){
                allCardList[i].style.display = 'flex';
            }else if(!(allCardList[i].getAttribute('name') == selectedValue)){
                allCardList[i].style.display = 'none';
            }
            if(selectedValue === 'All'){
                allCardList[i].style.display = 'flex';
            }
        }
    }

}